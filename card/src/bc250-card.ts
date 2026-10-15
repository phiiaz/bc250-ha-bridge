import { LitElement, html, nothing, type PropertyValues, type TemplateResult, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Bc250CardConfig, Hass, HassEntityState, SectionId } from "./types";
import { DEFAULT_SECTIONS } from "./types";
import { discoverEntities, looksLikeBridgeDevice, type EntityKey, type EntityMap, type RegistryEntry } from "./lib/discovery";
import { formatUptime, formatValue, fraction, severity, toNumber, type Severity } from "./lib/format";
import { snapClock, validateClock, type ClockLimits } from "./lib/clock";
import { buildPath, downsample, parseHistory, type Point } from "./lib/history";
import { makeTranslator, type Translator } from "./localize";
import type { TranslationKey } from "./translations";
import { cardStyles } from "./styles";
import "./bc250-card-editor";

const CARD_VERSION = "0.1.0";
const HISTORY_REFRESH_MS = 5 * 60 * 1000;
const FEEDBACK_MS = 2500;
const RING = 2 * Math.PI * 40;
const ARC = RING * 0.75;

interface ActionDef {
  key: "wake" | "sleep" | "reboot" | "shutdown" | "to_gamemode" | "to_desktop" | "restart_steam" | "close_game";
  icon: string;
  color: string;
  label: TranslationKey;
  confirm?: TranslationKey;
}

const ACTIONS: ActionDef[] = [
  { key: "wake", icon: "mdi:alarm-light", color: "#43a047", label: "wake" },
  { key: "sleep", icon: "mdi:sleep", color: "#42a5f5", label: "sleep", confirm: "confirm_sleep" },
  { key: "reboot", icon: "mdi:restart", color: "#fb8c00", label: "reboot", confirm: "confirm_reboot" },
  { key: "shutdown", icon: "mdi:power", color: "#e53935", label: "shutdown", confirm: "confirm_shutdown" },
  { key: "to_gamemode", icon: "mdi:controller", color: "#ab47bc", label: "game_mode", confirm: "confirm_game_mode" },
  { key: "to_desktop", icon: "mdi:desktop-tower-monitor", color: "#26a69a", label: "desktop", confirm: "confirm_desktop" },
  { key: "restart_steam", icon: "mdi:steam", color: "#5c6bc0", label: "restart_steam", confirm: "confirm_restart_steam" },
  { key: "close_game", icon: "mdi:close-circle", color: "#e53935", label: "close_game", confirm: "confirm_close_game" },
];

type Feedback = "sent" | "failed";

interface PendingConfirm {
  text: string;
  run: () => void;
}

interface Series {
  key: EntityKey;
  label: TranslationKey;
  color: string;
  vMin?: number;
  vMax?: number;
}

@customElement("bc250-card")
export class Bc250Card extends LitElement {
  static styles = cardStyles;

  @property({ attribute: false }) hass?: Hass;
  @state() private _config?: Bc250CardConfig;
  @state() private _map: EntityMap = {};
  @state() private _history: Partial<Record<EntityKey, Point[]>> = {};
  @state() private _feedback: Partial<Record<string, Feedback>> = {};
  @state() private _confirm?: PendingConfirm;
  @state() private _advOpen = false;
  @state() private _draftMax?: number;
  @state() private _draftMin?: number;
  @state() private _advError?: string;

  private _discoveredFor?: string;
  private _historyTimer?: number;
  private _lastHistoryFetch = 0;

  // ---- Lovelace API -------------------------------------------------------

  static getConfigElement(): HTMLElement {
    return document.createElement("bc250-card-editor");
  }

  static getStubConfig(hass?: Hass): Partial<Bc250CardConfig> {
    const byDevice = new Map<string, string[]>();
    for (const e of Object.values(hass?.entities ?? {})) {
      if (!e.device_id) continue;
      byDevice.set(e.device_id, [...(byDevice.get(e.device_id) ?? []), e.entity_id]);
    }
    for (const [id, ids] of byDevice) if (looksLikeBridgeDevice(ids)) return { device_id: id };
    return { device_id: "" };
  }

  setConfig(config: Bc250CardConfig): void {
    if (!config || typeof config !== "object") throw new Error("Invalid configuration");
    this._config = {
      show_advanced: false,
      show_history: true,
      history_hours: 6,
      confirm_actions: true,
      glass: false,
      sections: DEFAULT_SECTIONS,
      ...config,
    };
    this._discoveredFor = undefined;
    this._lastHistoryFetch = 0;
  }

  getCardSize(): number {
    return 8;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }

  // ---- lifecycle ----------------------------------------------------------

  connectedCallback(): void {
    super.connectedCallback();
    this._historyTimer = window.setInterval(() => void this._loadHistory(), HISTORY_REFRESH_MS);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearInterval(this._historyTimer);
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.size > 1 || !changed.has("hass")) return true;
    const old = changed.get("hass") as Hass | undefined;
    if (!old || !this.hass) return true;
    return this._trackedIds().some((id) => old.states[id] !== this.hass!.states[id]);
  }

  protected willUpdate(changed: PropertyValues): void {
    if (!this.hass || !this._config?.device_id) return;
    if (this._discoveredFor !== this._config.device_id) {
      this._discoveredFor = this._config.device_id;
      const fromDisplay = Object.values(this.hass.entities ?? {}) as RegistryEntry[];
      this._map = discoverEntities(fromDisplay, this._config.device_id);
      void this._discoverWithRegistry(this._config.device_id);
    }
    if (!this._isOnline()) {
      // Machine went away: drop any pending confirmation and unsent clock edits.
      if (this._confirm) this._confirm = undefined;
      if (this._draftMax !== undefined) this._draftMax = undefined;
      if (this._draftMin !== undefined) this._draftMin = undefined;
    }
    if (changed.has("hass") && this._config.show_history && Date.now() - this._lastHistoryFetch > HISTORY_REFRESH_MS) {
      void this._loadHistory();
    }
  }

  /** The full registry carries unique_ids (survives entity renames) but needs admin rights. */
  private async _discoverWithRegistry(deviceId: string): Promise<void> {
    try {
      const full = await this.hass!.callWS<RegistryEntry[]>({ type: "config/entity_registry/list" });
      if (this._config?.device_id !== deviceId) return;
      this._map = discoverEntities(full, deviceId);
      void this._loadHistory();
    } catch {
      /* non-admin user: keep the display-registry based map */
    }
  }

  private _trackedIds(): string[] {
    const ids: string[] = Object.values(this._map).filter((v): v is string => !!v);
    if (this._config?.wol_entity) ids.push(this._config.wol_entity);
    return ids;
  }

  // ---- state helpers ------------------------------------------------------

  private _st(key: EntityKey): HassEntityState | undefined {
    const id = this._map[key];
    return id ? this.hass?.states[id] : undefined;
  }

  private _num(key: EntityKey): number | undefined {
    return toNumber(this._st(key)?.state);
  }

  private _isOnline(): boolean {
    const probe = this._st("cpu_temp") ?? this._st("uptime") ?? this._st("gpu_clock");
    return !!probe && probe.state !== "unavailable";
  }

  // ---- history ------------------------------------------------------------

  private async _loadHistory(): Promise<void> {
    if (!this.hass || !this._config?.show_history) return;
    const keys: EntityKey[] = ["cpu_temp", "gpu_temp", "nvme_temp", "gpu_clock", "gpu_load"];
    const ids = keys.map((k) => this._map[k]).filter((v): v is string => !!v);
    if (!ids.length) return;
    this._lastHistoryFetch = Date.now();
    const hours = Math.max(1, Math.min(48, this._config.history_hours ?? 6));
    try {
      const res = await this.hass.callWS<Record<string, unknown>>({
        type: "history/history_during_period",
        start_time: new Date(Date.now() - hours * 3600_000).toISOString(),
        end_time: new Date().toISOString(),
        entity_ids: ids,
        minimal_response: true,
        no_attributes: true,
        significant_changes_only: false,
      });
      const next: Partial<Record<EntityKey, Point[]>> = {};
      for (const k of keys) {
        const id = this._map[k];
        if (id && res[id]) next[k] = downsample(parseHistory(res[id]), 150);
      }
      this._history = next;
    } catch {
      this._lastHistoryFetch = 0;
    }
  }

  // ---- actions ------------------------------------------------------------

  private _entityFor(a: ActionDef): string | undefined {
    return a.key === "wake" ? this._config?.wol_entity : this._map[a.key];
  }

  private _onAction(a: ActionDef, t: Translator): void {
    const id = this._entityFor(a);
    if (!id) return;
    const run = () => void this._press(id, a.key);
    if (a.confirm && this._config?.confirm_actions !== false) {
      this._confirm = { text: t(a.confirm), run };
    } else run();
  }

  private async _press(entityId: string, key: string): Promise<void> {
    if (key !== "wake" && !this._isOnline()) return;
    try {
      await this.hass!.callService("button", "press", {}, { entity_id: entityId });
      this._flash(key, "sent");
    } catch {
      this._flash(key, "failed");
    }
  }

  private _flash(key: string, kind: Feedback): void {
    this._feedback = { ...this._feedback, [key]: kind };
    window.setTimeout(() => {
      const { [key]: _drop, ...rest } = this._feedback;
      this._feedback = rest;
    }, FEEDBACK_MS);
  }

  // ---- advanced -----------------------------------------------------------

  private _limits(): ClockLimits {
    const a = (this._st("gpu_max_clock") ?? this._st("gpu_min_clock"))?.attributes;
    return { min: Number(a?.min ?? 1000), max: Number(a?.max ?? 2200), step: Number(a?.step ?? 50) };
  }

  private _applyClock(t: Translator): void {
    if (!this._isOnline()) return;
    const lim = this._limits();
    const curMin = this._num("gpu_min_clock");
    const curMax = this._num("gpu_max_clock");
    const newMax = this._draftMax ?? curMax;
    const newMin = this._draftMin ?? curMin;
    if (newMax === undefined || newMin === undefined || curMin === undefined || curMax === undefined) return;

    const errKey = (r: { ok: false; reason: string }): TranslationKey => `err_${r.reason}` as TranslationKey;
    // Validate the final range first (against itself), then step through it in a safe order.
    const rMax = validateClock("Max", newMax, lim, newMin, undefined);
    const rMin = validateClock("Min", newMin, lim, undefined, newMax);
    const bad = !rMax.ok ? rMax : !rMin.ok ? rMin : undefined;
    if (bad && !bad.ok) {
      this._advError = t(errKey(bad));
      return;
    }
    this._advError = undefined;

    const setMax = () => this._setNumber("gpu_max_clock", newMax);
    const setMin = () => this._setNumber("gpu_min_clock", newMin);
    void (async () => {
      // Raising max: max first. Lowering max: min first. Keeps min <= max at every step.
      const steps = newMax >= curMax ? [setMax, setMin] : [setMin, setMax];
      for (const step of steps) await step();
      this._draftMax = undefined;
      this._draftMin = undefined;
    })();
  }

  private async _setNumber(key: EntityKey, value: number): Promise<void> {
    const id = this._map[key];
    if (!id || !this._isOnline() || value === this._num(key)) return;
    try {
      await this.hass!.callService("number", "set_value", { value }, { entity_id: id });
      this._flash(key, "sent");
    } catch {
      this._flash(key, "failed");
    }
  }

  // ---- render -------------------------------------------------------------

  protected render(): TemplateResult {
    const t = makeTranslator(this.hass?.language);
    if (!this._config?.device_id) {
      return html`<ha-card><div class="message">${t("not_configured")}</div></ha-card>`;
    }
    if (this.hass && !Object.keys(this._map).length) {
      return html`<ha-card><div class="message">${t("not_found")}</div></ha-card>`;
    }
    const style = [
      this._config.accent_color ? `--bc250-accent:${this._config.accent_color}` : "",
      this._config.background_color ? `--bc250-bg:${this._config.background_color}` : "",
    ].join(";");
    const sections = this._config.sections ?? DEFAULT_SECTIONS;
    return html`
      <ha-card class=${this._config.glass ? "glass" : ""} style=${style}>
        ${sections.map((s) => this._section(s, t))}
        ${this._config.show_advanced
          ? html`<section class=${this._isOnline() ? "" : "dim"}>${this._renderAdvanced(t)}</section>`
          : nothing}
        ${this._confirm
          ? html`<div class="overlay" @click=${() => (this._confirm = undefined)}>
              <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
                <p>${this._confirm.text}</p>
                <div class="row-btns">
                  <button class="pill" @click=${() => (this._confirm = undefined)}>${t("cancel")}</button>
                  <button
                    class="pill primary"
                    @click=${() => {
                      const run = this._confirm!.run;
                      this._confirm = undefined;
                      run();
                    }}
                  >
                    ${t("confirm")}
                  </button>
                </div>
              </div>
            </div>`
          : nothing}
      </ha-card>
    `;
  }

  private _section(id: SectionId, t: Translator): TemplateResult | typeof nothing {
    const dim = this._isOnline() ? "" : "dim";
    switch (id) {
      case "header":
        return html`<section>${this._renderHeader(t)}</section>`;
      case "vitals":
        return html`<section class=${dim}>${this._renderVitals(t)}</section>`;
      case "history":
        return this._config?.show_history ? html`<section class=${dim}>${this._renderHistory(t)}</section>` : nothing;
      case "system":
        return html`<section class=${dim}>${this._renderSystem(t)}</section>`;
      case "actions":
        return html`<section>${this._renderActions(t)}</section>`;
      default:
        return nothing;
    }
  }

  private _renderHeader(t: Translator): TemplateResult {
    const dev = this.hass?.devices?.[this._config!.device_id];
    const name = this._config!.name ?? dev?.name_by_user ?? dev?.name ?? "BC-250";
    const online = this._isOnline();
    const game = this._st("current_game")?.state;
    const playing = online && game && game !== "none" && game !== "unknown" ? game : undefined;
    return html`
      <div class="header">
        <span class="title">${name}</span>
        <span class="badge ${online ? "on" : ""}"><span class="dot"></span>${online ? t("online") : t("offline")}</span>
        <span class="spacer"></span>
        <span class="meta">${t("uptime")}: ${online ? formatUptime(this._num("uptime")) : "–"}</span>
      </div>
      ${online
        ? html`<div class="now">
            <ha-icon icon="mdi:gamepad-variant"></ha-icon>
            <div>
              <div class="label">${t("now_playing")}</div>
              <div>${playing ?? t("idle")}</div>
            </div>
          </div>`
        : html`<div class="now off-banner">
            <ha-icon icon="mdi:power-sleep"></ha-icon>
            <div>
              <div>${t("off_title")}</div>
              <div class="label">${this._config!.wol_entity ? t("off_hint") : t("no_wol")}</div>
            </div>
          </div>`}
    `;
  }

  private _renderVitals(t: Translator): TemplateResult {
    const throttle = this._num("throttle_temp") ?? 85;
    return html`<div class="vitals">
      ${this._gauge(t("cpu"), this._num("cpu_temp"), "°C", 20, 100, severity(this._num("cpu_temp"), throttle - 15, throttle))}
      ${this._gauge(t("gpu"), this._num("gpu_temp"), "°C", 20, 100, severity(this._num("gpu_temp"), throttle - 15, throttle))}
      ${this._gauge(t("gpu_load"), this._num("gpu_load"), "%", 0, 100, severity(this._num("gpu_load"), 85, 98))}
      ${this._clockGauge(t("clock"))}
    </div>`;
  }

  private _gauge(name: string, v: number | undefined, unit: string, lo: number, hi: number, sev: Severity): TemplateResult {
    const f = fraction(v, lo, hi);
    return html`<div class="gauge">
      <svg viewBox="0 0 100 100">
        ${svg`<circle class="track" cx="50" cy="50" r="40" fill="none" stroke-width="8" stroke-linecap="round"
          stroke-dasharray="${ARC} ${RING}" />
        <circle class="arc ${sev}" cx="50" cy="50" r="40" fill="none" stroke-width="8"
          stroke-dasharray="${f * ARC} ${RING}" />`}
      </svg>
      <div class="value">${formatValue(v, unit === "°C" ? 1 : 0)}<small>${unit}</small></div>
      <div class="name">${name}</div>
    </div>`;
  }

  /** Current clock as an arc across the allowed range, with the governor's min/max in the caption. */
  private _clockGauge(name: string): TemplateResult {
    const lim = this._limits();
    const v = this._num("gpu_clock");
    const sev: Severity = v !== undefined && v >= lim.max ? "crit" : v !== undefined && v >= lim.max - 200 ? "warn" : "ok";
    return this._gauge(name, v, "MHz", 500, lim.max + 200, sev);
  }

  private _renderHistory(t: Translator): TemplateResult {
    const temps: Series[] = [
      { key: "cpu_temp", label: "cpu", color: "#42a5f5" },
      { key: "gpu_temp", label: "gpu", color: "#ffa726" },
      { key: "nvme_temp", label: "nvme", color: "#ef5350" },
    ];
    const perf: Series[] = [
      { key: "gpu_clock", label: "clock", color: "#42a5f5" },
      { key: "gpu_load", label: "load", color: "#ab47bc", vMin: 0, vMax: 100 },
    ];
    return html`<h3>${t("temperatures")} · ${t("clock_and_load")}</h3>
      <div class="charts">${this._chart(t("temperatures"), temps, t)} ${this._chart(t("clock_and_load"), perf, t)}</div>`;
  }

  private _chart(title: string, series: Series[], t: Translator): TemplateResult {
    const W = 300;
    const H = 70;
    const all = series.flatMap((s) => this._history[s.key] ?? []);
    const tMax = Date.now();
    const tMin = tMax - (this._config?.history_hours ?? 6) * 3600_000;
    const shared = all.length ? [Math.min(...all.map((p) => p.v)), Math.max(...all.map((p) => p.v))] : [0, 1];
    return html`<div class="chart">
      <div class="ctitle">${title}</div>
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
        ${series.map((s) => {
          const pts = this._history[s.key] ?? [];
          let vMin = s.vMin;
          let vMax = s.vMax;
          if (vMin === undefined || vMax === undefined) {
            // Per-series scale for mixed units (clock), shared scale for like units (temps).
            const own = pts.length ? [Math.min(...pts.map((p) => p.v)), Math.max(...pts.map((p) => p.v))] : shared;
            const range = series.every((x) => x.vMin === undefined) && series[0].key.endsWith("_temp") ? shared : own;
            vMin = range[0] - 1;
            vMax = range[1] + 1;
          }
          const d = buildPath(pts, { width: W, height: H, tMin, tMax, vMin, vMax });
          return d
            ? svg`<path d=${d} fill="none" stroke=${s.color} stroke-width="1.6" vector-effect="non-scaling-stroke" />`
            : nothing;
        })}
      </svg>
      <div class="legend">
        ${series.map((s) => {
          const v = this._num(s.key);
          return html`<span><i style="background:${s.color}"></i>${t(s.label)} ${formatValue(v, v !== undefined && v % 1 ? 1 : 0)}</span>`;
        })}
      </div>
    </div>`;
  }

  private _renderSystem(t: Translator): TemplateResult {
    const bar = (label: string, v: number | undefined) => html`<div class="tile">
      <div class="tname">${label}</div>
      <div class="tval">${formatValue(v, 1)} %</div>
      <div class="bar ${severity(v, 80, 95) === "ok" ? "" : severity(v, 80, 95)}"><div style="width:${v ?? 0}%"></div></div>
    </div>`;
    const tile = (label: string, value: string) =>
      html`<div class="tile"><div class="tname">${label}</div><div class="tval">${value}</div></div>`;
    const batt = this._num("logi_battery");
    const pump = this._num("pump_rpm");
    const cu = this._num("cu_active");
    const thr = this._num("throttle_temp");
    return html`<h3>${t("system")}</h3>
      <div class="tiles">
        ${tile(t("pump"), pump === undefined ? "–" : `${Math.round(pump)} RPM`)} ${bar(t("ram"), this._num("ram_used"))}
        ${bar(t("swap"), this._num("swap_used"))} ${bar(t("disk"), this._num("disk_used"))}
        ${tile(t("cus"), cu === undefined ? "–" : `${cu} CU`)} ${tile(t("throttle"), thr === undefined ? "–" : `${thr} °C`)}
        ${batt !== undefined ? tile(t("battery"), `${Math.round(batt)} %`) : nothing}
      </div>`;
  }

  private _renderActions(t: Translator): TemplateResult {
    const online = this._isOnline();
    return html`<h3>${t("actions")}</h3>
      <div class="actions">
        ${ACTIONS.map((a) => {
          const id = this._entityFor(a);
          const disabled = !id || (a.key !== "wake" && !online);
          const fb = this._feedback[a.key];
          const title = a.key === "wake" && !id ? t("no_wol") : "";
          const pulse = a.key === "wake" && !online && !disabled ? "pulse" : "";
          return html`<button
            class="act ${fb ?? ""} ${pulse}"
            style="--c:${a.color}"
            title=${title}
            ?disabled=${disabled}
            @click=${() => this._onAction(a, t)}
          >
            <ha-icon icon=${a.icon}></ha-icon>
            <span>${fb ? t(fb) : t(a.label)}</span>
          </button>`;
        })}
      </div>`;
  }

  private _renderAdvanced(t: Translator): TemplateResult {
    const online = this._isOnline();
    const open = this._advOpen && online;
    return html`<button class="adv-toggle" ?disabled=${!online} @click=${() => (this._advOpen = !open)}>
        <ha-icon icon=${open ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>
        <ha-icon icon="mdi:alert"></ha-icon>
        <h3 style="margin:0;color:inherit">${t("advanced")} · ${t("advanced_title")}</h3>
      </button>
      ${open ? this._advancedBody(t) : nothing}`;
  }

  private _advancedBody(t: Translator): TemplateResult {
    const lim = this._limits();
    const online = this._isOnline();
    const curMax = this._num("gpu_max_clock");
    const curMin = this._num("gpu_min_clock");
    const max = this._draftMax ?? curMax ?? lim.max;
    const min = this._draftMin ?? curMin ?? lim.min;
    const dirty = (this._draftMax !== undefined && this._draftMax !== curMax) || (this._draftMin !== undefined && this._draftMin !== curMin);
    const row = (label: string, value: number, onInput: (n: number) => void) => html`<div class="clock-row">
      <span>${label}</span>
      <input
        type="range"
        .min=${String(lim.min)}
        .max=${String(lim.max)}
        .step=${String(lim.step)}
        .value=${String(value)}
        ?disabled=${!online}
        @input=${(e: Event) => onInput(snapClock(Number((e.target as HTMLInputElement).value), lim))}
      />
      <span
        ><input
          type="number"
          .min=${String(lim.min)}
          .max=${String(lim.max)}
          .step=${String(lim.step)}
          .value=${String(value)}
          ?disabled=${!online}
          @change=${(e: Event) => onInput(Number((e.target as HTMLInputElement).value))}
        />
        MHz</span
      >
    </div>`;
    const volt = this._num("cfg_voltage");
    const cu = this._num("cu_active");
    return html`<div class="adv">
      <p>${t("advanced_warning")}</p>
      ${row(t("max_clock"), max, (n) => ((this._draftMax = n), (this._advError = undefined)))}
      ${row(t("min_clock"), min, (n) => ((this._draftMin = n), (this._advError = undefined)))}
      ${this._advError ? html`<div class="err">${this._advError}</div>` : nothing}
      <div class="row-btns">
        <button class="pill primary" ?disabled=${!online || !dirty} @click=${() => this._applyClock(t)}>${t("apply")}</button>
        <button
          class="pill"
          ?disabled=${!online || !this._map.gpu_reset}
          @click=${() => {
            const id = this._map.gpu_reset;
            if (id) this._confirm = { text: t("confirm_gpu_reset"), run: () => void this._press(id, "gpu_reset") };
          }}
        >
          ${t("reset")}
        </button>
      </div>
      <h3 style="margin-top:14px">${t("readonly_values")}</h3>
      <p>${t("readonly_note")}</p>
      <div class="tiles">
        <div class="tile"><div class="tname">${t("voltage")}</div><div class="tval">${volt === undefined ? "–" : `${volt} mV`}</div></div>
        <div class="tile"><div class="tname">${t("active_cus")}</div><div class="tval">${cu === undefined ? "–" : `${cu} CU`}</div></div>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "bc250-card": Bc250Card;
  }
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "bc250-card",
  name: "BC-250 Card",
  description: "Dashboard and controls for the bc250-ha-bridge device",
  preview: false,
  documentationURL: "https://github.com/phiiaz/bc250-ha-bridge",
});

console.info(`%c BC250-CARD %c v${CARD_VERSION} `, "background:#03a9f4;color:#fff", "background:#333;color:#fff");
