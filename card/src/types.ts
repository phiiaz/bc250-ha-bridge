/** Minimal subset of the Home Assistant frontend types used by the card. */
export interface HassEntityState {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown> & {
    friendly_name?: string;
    unit_of_measurement?: string;
    min?: number;
    max?: number;
    step?: number;
  };
  last_changed?: string;
  last_updated?: string;
}

export interface HassRegistryDisplayEntry {
  entity_id: string;
  device_id?: string | null;
  platform?: string;
  name?: string | null;
}

export interface HassDevice {
  id: string;
  name?: string | null;
  name_by_user?: string | null;
  manufacturer?: string | null;
  model?: string | null;
}

export interface Hass {
  states: Record<string, HassEntityState>;
  entities?: Record<string, HassRegistryDisplayEntry>;
  devices?: Record<string, HassDevice>;
  language?: string;
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ): Promise<unknown>;
  callWS<T = unknown>(msg: Record<string, unknown>): Promise<T>;
}

export interface Bc250CardConfig {
  type: string;
  device_id: string;
  name?: string;
  /** Wake-on-LAN button entity (belongs to another integration). */
  wol_entity?: string;
  show_advanced?: boolean;
  show_history?: boolean;
  history_hours?: number;
  confirm_actions?: boolean;
  /** Section order / visibility. */
  sections?: SectionId[];
  glass?: boolean;
  accent_color?: string;
  background_color?: string;
}

export type SectionId = "header" | "vitals" | "history" | "system" | "actions";

export const DEFAULT_SECTIONS: SectionId[] = ["header", "vitals", "history", "system", "actions"];
