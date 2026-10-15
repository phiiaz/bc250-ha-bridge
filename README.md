# bc250-ha-bridge

Expose an AMD **BC-250** gaming PC (Cyan Skillfish, running Bazzite or another Linux with the
`cyan-skillfish-governor-smu` GPU governor) to **Home Assistant** over **MQTT**,
with sensors, a few controls, and a ready-made dashboard.

One small Python script, standard library only. No `pip`, no containers, nothing installed
system-wide besides a systemd unit (and optionally a polkit rule).

> Built for one specific, heavily modified board. Read **Safety** before enabling the
> Advanced controls.

## What you get

**Sensors** (HA MQTT discovery, published every 30 s): CPU / GPU / NVMe temperature, GPU clock,
GPU load, pump RPM, RAM / swap / disk use, uptime, current Steam game, active CU count (from the
CU manager config), configured voltage at the current max clock, governor throttle temperature,
current GPU min/max range.

**Controls**: Sleep, Reboot, Shut down, Restart Steam, Switch to Desktop / Game mode,
Close current game, and an **[Advanced]** GPU min/max clock range with a Reset button.

**Availability**: the device shows *unavailable* in HA when the machine is asleep or off (MQTT
last-will). Wake it with HA's *Wake on LAN* integration (see below).

## Requirements

- An MQTT broker reachable from the PC (for example the Mosquitto add-on in Home Assistant)
  and an MQTT user for the bridge.
- Python 3.11+ (`tomllib`) and `systemd`.
- Optional: `cyan-skillfish-governor-smu` for the GPU clock features. Without it those entities
  report nothing.

## Install

```bash
git clone https://github.com/phiiaz/bc250-ha-bridge ~/bc250-ha-bridge

# 1. credentials (never commit the real file)
mkdir -p ~/.config/bc250-ha-bridge
cp ~/bc250-ha-bridge/env.example ~/.config/bc250-ha-bridge/env
chmod 600 ~/.config/bc250-ha-bridge/env && $EDITOR ~/.config/bc250-ha-bridge/env

# 2. try it without touching the network, then once against the broker
python3 -I ~/bc250-ha-bridge/publisher.py --dry-run
python3 -I ~/bc250-ha-bridge/publisher.py --once

# 3. run it as a service (edit YOUR_USER first)
sudo cp ~/bc250-ha-bridge/systemd/bc250-ha-bridge.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable --now bc250-ha-bridge
journalctl -u bc250-ha-bridge -f
```

A device named **Bazzite BC-250** appears under Settings → Devices & Services → MQTT.

### Power buttons need a polkit rule

The service has no login session, so `systemctl reboot/poweroff/suspend` would be refused.
`polkit/50-bc250-ha-bridge-power.rules` allows exactly those three actions for one user
(not the `*-ignore-inhibit` variants). Edit `YOUR_USER`, then:

```bash
sudo cp polkit/50-bc250-ha-bridge-power.rules /etc/polkit-1/rules.d/
```

Skip it if you do not want the power buttons; they will just log an error.

### Dashboard

`homeassistant/dashboard.yaml` uses built-in cards only (HA 2024.x+, sections layout). Create a
dashboard, open the Raw configuration editor and paste it. Entity IDs assume a fresh install
(`sensor.bazzite_bc_250_*`). If your IDs differ, fix them in the file. Replace
`button.wake_on_lan` with the button from your Wake on LAN integration. Destructive buttons ask
for confirmation.

### Wake on LAN

Enable magic-packet wake on the NIC, persistently, with NetworkManager:

```bash
nmcli connection modify "Wired connection 1" 802-3-ethernet.wake-on-lan magic
```

Then add HA's *Wake on LAN* integration with the PC's MAC address. Whether the board wakes
from sleep or from a full shutdown depends on its BIOS. Test both.

## Safety

- **GPU clock control**: limits are enforced inside `publisher.py`
  (`BRIDGE_CLOCK_FLOOR` / `BRIDGE_CLOCK_CEIL`, default 1000 to 2200 MHz, steps of 50), not only
  in HA. The default ceiling is the author's own tested value on one board. **Set yours.**
  Changes go through the governor's runtime D-Bus interface, are not persisted, and reset on a
  governor restart or reboot. The governor config file is never touched.
- **Voltage and CU count are read-only on purpose.** There is no runtime interface for them and
  a wrong value can hang the machine.
- Commands come from a fixed whitelist. MQTT payloads never reach a shell.
- Use a dedicated, LAN-only MQTT user with a strong password.
- "Close current game" sends SIGTERM to Steam's `reaper` process for the running game. It
  does not force-kill, and unsaved progress is lost.

## Known limits

- GPU load is an average over the 30 s sampling window, not a live gauge.
- "Current Steam game" only sees games launched through Steam.
- While the PC sleeps, the bridge is frozen; it reconnects about 15 s after waking.

## Files

| Path | Purpose |
|---|---|
| `publisher.py` | The bridge (sensors, controls, MQTT discovery) |
| `env.example` | Credentials template |
| `systemd/bc250-ha-bridge.service` | System unit |
| `polkit/50-bc250-ha-bridge-power.rules` | Optional power-control permission |
| `homeassistant/dashboard.yaml` | Dashboard |

## License

MIT, see `LICENSE`.
