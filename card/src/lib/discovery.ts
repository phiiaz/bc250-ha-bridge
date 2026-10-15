import type { HassRegistryDisplayEntry } from "../types";

export type EntityDomain = "sensor" | "button" | "number";

interface Def {
  domain: EntityDomain;
  /** unique_id published by publisher.py is `${NODE}_${uniquePrefix}${key}` */
  uniquePrefix: string;
  /** Default entity-id tail HA generates from the entity name (after the device slug). */
  slug: string;
}

const S = (slug: string): Def => ({ domain: "sensor", uniquePrefix: "", slug });
const B = (slug: string): Def => ({ domain: "button", uniquePrefix: "btn_", slug });
const N = (slug: string): Def => ({ domain: "number", uniquePrefix: "num_", slug });

/** Every entity the bridge creates, keyed by the key used in publisher.py. */
export const ENTITY_DEFS = {
  cpu_temp: S("cpu_temperature"),
  gpu_temp: S("gpu_temperature"),
  nvme_temp: S("nvme_temperature"),
  gpu_clock: S("gpu_clock"),
  pump_rpm: S("pump_speed"),
  ram_used: S("ram_used"),
  swap_used: S("swap_used"),
  disk_used: S("home_disk_used"),
  uptime: S("uptime"),
  gpu_load: S("gpu_load"),
  current_game: S("current_steam_game"),
  cu_active: S("active_cus_config"),
  cfg_voltage: S("config_voltage_at_max_clock"),
  throttle_temp: S("gpu_throttle_temperature"),
  logi_battery: S("logitech_battery"),

  sleep: B("sleep"),
  reboot: B("reboot"),
  shutdown: B("shut_down"),
  close_game: B("close_current_game"),
  restart_steam: B("restart_steam"),
  to_desktop: B("switch_to_desktop_mode"),
  to_gamemode: B("switch_to_game_mode"),
  gpu_reset: B("advanced_reset_gpu_clock_range"),

  gpu_max_clock: N("advanced_gpu_max_clock"),
  gpu_min_clock: N("advanced_gpu_min_clock"),
} as const satisfies Record<string, Def>;

export type EntityKey = keyof typeof ENTITY_DEFS;
export type EntityMap = Partial<Record<EntityKey, string>>;

export interface RegistryEntry extends HassRegistryDisplayEntry {
  /** Only present when the full (admin) entity registry could be read. */
  unique_id?: string;
}

/**
 * Map the bridge's logical keys to this device's entity ids.
 *
 * Preference: exact unique_id (survives entity renames) when the full registry is available,
 * otherwise the entity-id tail HA generates from the default entity name.
 */
export function discoverEntities(entries: RegistryEntry[], deviceId: string): EntityMap {
  const own = entries.filter((e) => e.device_id === deviceId);
  const out: EntityMap = {};
  for (const key of Object.keys(ENTITY_DEFS) as EntityKey[]) {
    const def: Def = ENTITY_DEFS[key];
    const wanted = `${def.uniquePrefix}${key}`;
    const inDomain = own.filter((e) => e.entity_id.startsWith(`${def.domain}.`));

    const byUnique = inDomain.find(
      (e) => e.unique_id !== undefined && (e.unique_id === wanted || e.unique_id.endsWith(`_${wanted}`)),
    );
    if (byUnique) {
      out[key] = byUnique.entity_id;
      continue;
    }
    const bySlug = inDomain.find((e) => tailMatches(e.entity_id, def.slug));
    if (bySlug) out[key] = bySlug.entity_id;
  }
  return out;
}

/** `sensor.bazzite_bc_250_cpu_temperature` and `..._cpu_temperature_2` both match `cpu_temperature`. */
function tailMatches(entityId: string, slug: string): boolean {
  const objectId = entityId.slice(entityId.indexOf(".") + 1);
  return objectId === slug || objectId.endsWith(`_${slug}`) || new RegExp(`_${slug}_\\d+$`).test(objectId);
}

/** Find candidate devices (for the editor / stub config): MQTT devices that look like the bridge. */
export function looksLikeBridgeDevice(entityIds: string[]): boolean {
  return entityIds.some((id) => id.startsWith("button.") && id.endsWith("_close_current_game"));
}
