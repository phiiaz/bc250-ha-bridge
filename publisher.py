#!/usr/bin/env python3
"""Publish Bazzite (BC-250) machine sensors to Home Assistant over MQTT.

Read-only, standard library only. Credentials come from the env file
~/.config/bc250-ha-bridge/env (override with BRIDGE_ENV) (MQTT_HOST, MQTT_PORT, MQTT_USER, MQTT_PASS).
Uses HA MQTT discovery, with last-will for the online/offline state.

Usage: publisher.py [--once] [--dry-run]
  --once     publish one round and exit
  --dry-run  print sensor values, do not connect to the broker
"""
import glob
import json
import os
import re
import signal
import socket
import struct
import subprocess
import sys
import time
import tomllib

ENV_FILE = os.environ.get("BRIDGE_ENV", os.path.expanduser("~/.config/bc250-ha-bridge/env"))
NODE = "bazzite"
BASE = f"{NODE}"
AVAIL = f"{BASE}/status"
DISCOVERY = "homeassistant"
INTERVAL = 30
KEEPALIVE = 60

DEVICE = {
    "identifiers": ["bazzite_bc250"],
    "name": "Bazzite BC-250",
    "manufacturer": "AMD",
    "model": "BC-250 (Cyan Skillfish)",
}


def load_env(path):
    env = {}
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip()
    return env


def read(path):
    with open(path) as f:
        return f.read().strip()


def hwmon(name):
    for d in glob.glob("/sys/class/hwmon/hwmon*"):
        try:
            if read(f"{d}/name") == name:
                return d
        except OSError:
            pass
    return None


def temp(name, fname="temp1_input"):
    d = hwmon(name)
    return round(int(read(f"{d}/{fname}")) / 1000, 1) if d else None


def meminfo():
    m = {}
    with open("/proc/meminfo") as f:
        for line in f:
            k, v = line.split(":")
            m[k] = int(v.split()[0])  # kB
    return m


def ram_used_pct():
    m = meminfo()
    return round(100 * (m["MemTotal"] - m["MemAvailable"]) / m["MemTotal"], 1)


def swap_used_pct():
    m = meminfo()
    if not m["SwapTotal"]:
        return 0.0
    return round(100 * (m["SwapTotal"] - m["SwapFree"]) / m["SwapTotal"], 1)


def uptime_s():
    return int(float(read("/proc/uptime").split()[0]))


def pump_rpm():
    d = hwmon("nct6686")
    return int(read(f"{d}/fan2_input")) if d else None  # "Pump Fan" header


def gpu_clock():
    d = hwmon("amdgpu")
    return round(int(read(f"{d}/freq1_input")) / 1e6) if d else None


def disk_used_pct():
    st = os.statvfs("/var/home")
    return round(100 * (1 - st.f_bavail / st.f_blocks), 1)


def logi_battery():
    for p in glob.glob("/sys/class/power_supply/hidpp_battery_*/capacity"):
        try:
            return int(read(p))
        except (OSError, ValueError):
            pass
    return None


def cu_active():
    with open("/etc/bc250-cu-live-manager.conf") as f:
        m = re.search(r"^BC250_WGP_MASKS=(\S+)", f.read(), re.M)
    return sum(bin(int(x, 16)).count("1") for x in m.group(1).split(",")) * 2  # 2 CU per WGP


def config_voltage_at_max_clock():
    """mV from the governor config's safe-points for the highest point <= current max clock."""
    with open("/etc/cyan-skillfish-governor-smu/config.toml", "rb") as f:
        pts = tomllib.load(f)["safe-points"]
    cur = gov_get("Current", "Max")
    ok = [p for p in pts if p["frequency"] <= cur]
    return max(ok, key=lambda p: p["frequency"])["voltage"] if ok else None


def throttle_temp():
    r = subprocess.run(["busctl", "--system", "get-property", GOV, "/com/cyanskillfish/Governor",
                        f"{GOV}.PerformanceMode", "TemperatureThrottling"],
                       capture_output=True, text=True, timeout=5, check=True)
    return int(r.stdout.split()[1])


# GPU load from the kernel's per-client DRM counters (fdinfo), readable without root.
_gpu_prev = {"t": None, "ns": {}}


def _drm_clients():
    """{client-id: busy ns (gfx+compute)} for every amdgpu client this user can see."""
    out = {}
    for pid in os.listdir("/proc"):
        if not pid.isdigit():
            continue
        try:
            fds = os.listdir(f"/proc/{pid}/fd")
        except OSError:
            continue
        for fd in fds:
            try:
                if not os.readlink(f"/proc/{pid}/fd/{fd}").startswith("/dev/dri/"):
                    continue
                with open(f"/proc/{pid}/fdinfo/{fd}") as f:
                    info = dict(l.split(":", 1) for l in f.read().splitlines() if ":" in l)
            except OSError:
                continue
            if info.get("drm-driver", "").strip() != "amdgpu":
                continue
            ns = sum(int(info[k].split()[0]) for k in ("drm-engine-gfx", "drm-engine-compute") if k in info)
            out[info["drm-client-id"].strip()] = ns
    return out


def gpu_load():
    """Average GPU busy % since the previous call (None on the first call)."""
    now, cur = time.monotonic(), _drm_clients()
    prev_t, prev = _gpu_prev["t"], _gpu_prev["ns"]
    _gpu_prev["t"], _gpu_prev["ns"] = now, cur
    if prev_t is None:
        return None
    busy = sum(max(0, ns - prev.get(cid, 0)) for cid, ns in cur.items())
    return round(min(100.0, 100 * busy / ((now - prev_t) * 1e9)), 1)


# Steam wraps each running game in "reaper SteamLaunch AppId=<id> -- ..."
def steam_reapers():
    out = []
    for pid in os.listdir("/proc"):
        if not pid.isdigit():
            continue
        try:
            with open(f"/proc/{pid}/cmdline", "rb") as f:
                args = f.read().split(b"\0")
        except OSError:
            continue
        if args and args[0].endswith(b"reaper") and b"SteamLaunch" in args:
            for a in args:
                if a.startswith(b"AppId="):
                    out.append((int(pid), a[6:].decode()))
    return out


def _app_name(appid):
    for lib in glob.glob(os.path.expanduser("~/.local/share/Steam/steamapps")) + \
            glob.glob("/run/media/*/*/SteamLibrary/steamapps") + glob.glob("/var/mnt/*/SteamLibrary/steamapps"):
        try:
            with open(f"{lib}/appmanifest_{appid}.acf") as f:
                m = re.search(r'"name"\s+"([^"]*)"', f.read())
                if m:
                    return m.group(1)
        except OSError:
            pass
    return f"AppId {appid}"


def current_game():
    names = sorted({_app_name(a) for _p, a in steam_reapers()})
    return ", ".join(names) if names else "none"


# key, name, getter, unit, device_class, icon
SENSORS = [
    ("cpu_temp", "CPU temperature", lambda: temp("k10temp"), "°C", "temperature", None),
    ("gpu_temp", "GPU temperature", lambda: temp("amdgpu"), "°C", "temperature", None),
    ("nvme_temp", "NVMe temperature", lambda: temp("nvme"), "°C", "temperature", None),
    ("gpu_clock", "GPU clock", gpu_clock, "MHz", "frequency", None),
    ("pump_rpm", "Pump speed", pump_rpm, "RPM", None, "mdi:fan"),
    ("ram_used", "RAM used", ram_used_pct, "%", None, "mdi:memory"),
    ("swap_used", "Swap used", swap_used_pct, "%", None, "mdi:memory"),
    ("disk_used", "Home disk used", disk_used_pct, "%", None, "mdi:harddisk"),
    ("uptime", "Uptime", uptime_s, "s", "duration", None),
    ("gpu_load", "GPU load", gpu_load, "%", None, "mdi:expansion-card"),
    ("current_game", "Current Steam game", current_game, None, None, "mdi:gamepad-variant"),
    ("cu_active", "Active CUs (config)", cu_active, "CU", None, "mdi:chip"),
    ("cfg_voltage", "Config voltage at max clock", config_voltage_at_max_clock, "mV", None, "mdi:flash"),
    ("throttle_temp", "GPU throttle temperature", throttle_temp, "°C", "temperature", None),
    ("logi_battery", "Logitech battery", logi_battery, "%", "battery", None),
]


def collect():
    out = {}
    for key, _n, getter, *_ in SENSORS:
        try:
            out[key] = getter()
        except Exception as e:  # a broken sensor must not stop the rest
            print(f"sensor {key} failed: {e}", file=sys.stderr)
            out[key] = None
    for key, prop in (("gpu_max_clock", "Max"), ("gpu_min_clock", "Min")):
        try:
            out[key] = gov_get("Current", prop)
        except Exception as e:
            print(f"sensor {key} failed: {e}", file=sys.stderr)
            out[key] = None
    return out


# ---- minimal MQTT 3.1.1 client ----
def _s(b):
    if isinstance(b, str):
        b = b.encode()
    return struct.pack(">H", len(b)) + b


def _remlen(n):
    out = bytearray()
    while True:
        b, n = n % 128, n // 128
        out.append(b | (128 if n else 0))
        if not n:
            return bytes(out)


class Mqtt:
    def __init__(self, host, port, user, pw, client_id, will_topic):
        self.sock = socket.create_connection((host, port), timeout=10)
        flags = 0x02 | 0x04 | 0x20 | 0x80 | 0x40  # clean, will, will retain, user, pass
        body = (_s("MQTT") + bytes([4, flags]) + struct.pack(">H", KEEPALIVE)
                + _s(client_id) + _s(will_topic) + _s("offline") + _s(user) + _s(pw))
        self.sock.sendall(b"\x10" + _remlen(len(body)) + body)
        r = self._recv(4)
        if r[0] != 0x20 or r[3] != 0:
            raise ConnectionError(f"CONNACK refused: {r.hex()}")
        self.last = time.time()

    def _recv(self, n):
        buf = b""
        while len(buf) < n:
            c = self.sock.recv(n - len(buf))
            if not c:
                raise ConnectionError("broker closed connection")
            buf += c
        return buf

    def publish(self, topic, payload, retain=False):
        if not isinstance(payload, (str, bytes)):
            payload = json.dumps(payload)
        if isinstance(payload, str):
            payload = payload.encode()
        body = _s(topic) + payload
        self.sock.sendall(bytes([0x30 | (1 if retain else 0)]) + _remlen(len(body)) + body)
        self.last = time.time()

    def subscribe(self, topic):
        body = struct.pack(">H", 1) + _s(topic) + b"\x00"  # QoS 0
        self.sock.sendall(b"\x82" + _remlen(len(body)) + body)

    def poll(self, timeout):
        """Wait up to `timeout` s for one packet. Return (topic, payload) for a PUBLISH, else None."""
        self.sock.settimeout(timeout)
        try:
            first = self.sock.recv(1)
        except socket.timeout:
            return None
        finally:
            self.sock.settimeout(10)
        if not first:
            raise ConnectionError("broker closed connection")
        mult, n = 1, 0
        while True:
            b = self._recv(1)[0]
            n += (b & 127) * mult
            mult *= 128
            if not b & 128:
                break
        data = self._recv(n) if n else b""
        if first[0] >> 4 != 3:  # not a PUBLISH (SUBACK, PINGRESP, ...)
            return None
        tlen = struct.unpack(">H", data[:2])[0]
        return data[2:2 + tlen].decode(errors="replace"), data[2 + tlen:], bool(first[0] & 1)

    def ping_if_due(self):
        if time.time() - self.last > KEEPALIVE / 2:
            self.sock.sendall(b"\xc0\x00")
            self.last = time.time()

    def close(self):
        try:
            self.sock.sendall(b"\xe0\x00")
            self.sock.close()
        except OSError:
            pass


def announce(c):
    for key, name, _g, unit, dclass, icon in SENSORS:
        cfg = {
            "name": name,
            "unique_id": f"{NODE}_{key}",
            "state_topic": f"{BASE}/state",
            "value_template": f"{{{{ value_json.{key} }}}}",
            "availability_topic": AVAIL,
            "device": DEVICE,
        }
        if unit:
            cfg["unit_of_measurement"] = unit
            cfg["state_class"] = "measurement"
        if key == "uptime":
            cfg["state_class"] = "total_increasing"
        if dclass:
            cfg["device_class"] = dclass
        if icon:
            cfg["icon"] = icon
        if key == "logi_battery":
            cfg["availability_mode"] = "all"
        c.publish(f"{DISCOVERY}/sensor/{NODE}/{key}/config", cfg, retain=True)


# Controls: key -> (HA name, icon, command). Fixed whitelist; MQTT payloads never reach a shell.
BUTTONS = {
    "sleep": ("Sleep", "mdi:sleep", ["systemctl", "suspend"]),
    "reboot": ("Reboot", "mdi:restart", ["systemctl", "reboot"]),
    "shutdown": ("Shut down", "mdi:power", ["systemctl", "poweroff"]),
    "close_game": ("Close current game", "mdi:close-circle", None),  # handled in handle_command
    "restart_steam": ("Restart Steam", "mdi:steam", ["steam", "-shutdown"]),
    "to_desktop": ("Switch to Desktop mode", "mdi:desktop-tower-monitor", ["steamos-session-select", "plasma"]),
    "to_gamemode": ("Switch to Game mode", "mdi:controller", ["steamos-session-select", "gamescope"]),
}
# Commands that talk to the user's session need these when run from the system service.
USER_ENV = {"XDG_RUNTIME_DIR": f"/run/user/{os.getuid()}",
            "DBUS_SESSION_BUS_ADDRESS": f"unix:path=/run/user/{os.getuid()}/bus"}
CMD_PREFIX = f"{BASE}/cmd/"


def announce_buttons(c):
    for key, (name, icon, _cmd) in BUTTONS.items():
        cfg = {
            "name": name,
            "unique_id": f"{NODE}_btn_{key}",
            "command_topic": f"{CMD_PREFIX}{key}",
            "payload_press": "PRESS",
            "icon": icon,
            "availability_topic": AVAIL,
            "device": DEVICE,
        }
        c.publish(f"{DISCOVERY}/button/{NODE}/{key}/config", cfg, retain=True)


# ---- advanced / danger: GPU clock range via the governor's runtime D-Bus interface ----
# Runtime only: resets when the governor restarts or the machine reboots. config.toml is never touched.
GOV = "com.cyanskillfish.Governor"
RANGE = "/com/cyanskillfish/Governor/Range"
CLOCK_FLOOR = int(os.environ.get("BRIDGE_CLOCK_FLOOR", 1000))  # MHz, enforced here and not only in HA
CLOCK_CEIL = int(os.environ.get("BRIDGE_CLOCK_CEIL", 2200))  # MHz; the author's tested ceiling. Set your own!
CLOCK_STEP = 50


def gov_get(which, prop):
    r = subprocess.run(["busctl", "--system", "get-property", GOV, f"{RANGE}/{which}",
                        f"{GOV}.Range", prop], capture_output=True, text=True, timeout=5, check=True)
    return int(r.stdout.split()[1])


def gov_set(prop, mhz):
    subprocess.run(["busctl", "--system", "set-property", GOV, f"{RANGE}/Current",
                    f"{GOV}.Range", prop, "u", str(mhz)], capture_output=True, text=True,
                   timeout=5, check=True)


def set_clock(prop, mhz):
    """prop is 'Max' or 'Min'. Validate against hard limits and the other end of the range."""
    if not CLOCK_FLOOR <= mhz <= CLOCK_CEIL or mhz % CLOCK_STEP:
        raise ValueError(f"{prop} {mhz} MHz outside {CLOCK_FLOOR}-{CLOCK_CEIL} step {CLOCK_STEP}")
    if prop == "Max" and mhz < gov_get("Current", "Min"):
        raise ValueError(f"Max {mhz} below current Min")
    if prop == "Min" and mhz > gov_get("Current", "Max"):
        raise ValueError(f"Min {mhz} above current Max")
    gov_set(prop, mhz)


def reset_clock():
    # Restore the governor's initial range (min first so a lower max is never below min).
    imin, imax = gov_get("Initial", "Min"), gov_get("Initial", "Max")
    if gov_get("Current", "Max") < imin:
        gov_set("Max", imax)
    gov_set("Min", imin)
    gov_set("Max", imax)


NUMBERS = {
    "gpu_max_clock": ("GPU max clock", "Max"),
    "gpu_min_clock": ("GPU min clock", "Min"),
}


def announce_advanced(c):
    for key, (name, _prop) in NUMBERS.items():
        cfg = {
            "name": f"[Advanced] {name}",
            "unique_id": f"{NODE}_num_{key}",
            "command_topic": f"{CMD_PREFIX}{key}",
            "state_topic": f"{BASE}/state",
            "value_template": f"{{{{ value_json.{key} }}}}",
            "min": CLOCK_FLOOR, "max": CLOCK_CEIL, "step": CLOCK_STEP,
            "unit_of_measurement": "MHz",
            "mode": "box",
            "icon": "mdi:alert",
            "entity_category": "config",
            "availability_topic": AVAIL,
            "device": DEVICE,
        }
        c.publish(f"{DISCOVERY}/number/{NODE}/{key}/config", cfg, retain=True)
    cfg = {
        "name": "[Advanced] Reset GPU clock range",
        "unique_id": f"{NODE}_btn_gpu_reset",
        "command_topic": f"{CMD_PREFIX}gpu_reset",
        "payload_press": "PRESS",
        "icon": "mdi:alert",
        "entity_category": "config",
        "availability_topic": AVAIL,
        "device": DEVICE,
    }
    c.publish(f"{DISCOVERY}/button/{NODE}/gpu_reset/config", cfg, retain=True)


def handle_command(topic, payload, retained):
    if retained or not topic.startswith(CMD_PREFIX):
        return
    name = topic[len(CMD_PREFIX):]
    try:
        if name == "close_game" and payload == b"PRESS":
            games = steam_reapers()
            print(f"command: close game, reapers {games}", flush=True)
            for pid, _appid in games:
                os.kill(pid, signal.SIGTERM)  # graceful: reaper stops its child tree
        elif name in BUTTONS and payload == b"PRESS":
            print(f"command: {BUTTONS[name][2]}", flush=True)
            subprocess.run(BUTTONS[name][2], capture_output=True, text=True, timeout=30, check=True,
                           env={**os.environ, **USER_ENV})
        elif name == "gpu_reset" and payload == b"PRESS":
            print("command: reset GPU clock range", flush=True)
            reset_clock()
        elif name in NUMBERS:
            mhz = int(float(payload))
            print(f"command: GPU {NUMBERS[name][1]} -> {mhz} MHz", flush=True)
            set_clock(NUMBERS[name][1], mhz)
    except subprocess.CalledProcessError as e:
        print(f"command {name} failed ({e.returncode}): {(e.stderr or '').strip()}",
              file=sys.stderr, flush=True)
    except (ValueError, subprocess.TimeoutExpired) as e:
        print(f"command {name} rejected: {e}", file=sys.stderr, flush=True)


def main():
    once = "--once" in sys.argv
    if "--dry-run" in sys.argv:
        print(json.dumps(collect(), indent=2))
        return
    env = load_env(ENV_FILE)
    while True:
        try:
            c = Mqtt(env["MQTT_HOST"], int(env.get("MQTT_PORT", 1883)),
                     env["MQTT_USER"], env["MQTT_PASS"], f"{NODE}-publisher", AVAIL)
            announce(c)
            announce_buttons(c)
            announce_advanced(c)
            c.publish(AVAIL, "online", retain=True)
            if not once:
                c.subscribe(f"{CMD_PREFIX}+")
            while True:
                c.publish(f"{BASE}/state", collect(), retain=True)
                if once:
                    c.close()
                    return
                end = time.time() + INTERVAL
                while time.time() < end:
                    msg = c.poll(1.0)
                    if msg:
                        handle_command(*msg[:2], msg[2])
                        c.publish(f"{BASE}/state", collect(), retain=True)
                    c.ping_if_due()
        except (OSError, ConnectionError) as e:
            if once:
                raise
            print(f"connection problem: {e}; retrying in 15 s", file=sys.stderr)
            time.sleep(15)


if __name__ == "__main__":
    main()
