import { LitElement, html, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Bc250CardConfig, Hass } from "./types";
import { makeTranslator } from "./localize";

interface HaFormSchema {
  name: string;
  selector?: Record<string, unknown>;
  required?: boolean;
}

@customElement("bc250-card-editor")
export class Bc250CardEditor extends LitElement {
  @property({ attribute: false }) hass?: Hass;
  @state() private _config?: Bc250CardConfig;

  setConfig(config: Bc250CardConfig): void {
    this._config = config;
  }

  private _schema(): HaFormSchema[] {
    return [
      { name: "device_id", required: true, selector: { device: { filter: [{ integration: "mqtt" }] } } },
      { name: "name", selector: { text: {} } },
      { name: "wol_entity", selector: { entity: { domain: "button" } } },
      { name: "show_history", selector: { boolean: {} } },
      { name: "history_hours", selector: { number: { min: 1, max: 48, mode: "box" } } },
      { name: "show_advanced", selector: { boolean: {} } },
      { name: "confirm_actions", selector: { boolean: {} } },
      { name: "glass", selector: { boolean: {} } },
    ];
  }

  private _label = (schema: HaFormSchema): string => {
    const t = makeTranslator(this.hass?.language);
    const labels: Record<string, string> = {
      device_id: "Device",
      name: "Name (optional)",
      wol_entity: "Wake-on-LAN button (optional)",
      show_history: "Show history graphs",
      history_hours: "History hours",
      show_advanced: `${t("advanced")}: ${t("advanced_title")}`,
      confirm_actions: "Confirm destructive actions",
      glass: "Frosted-glass look",
    };
    return labels[schema.name] ?? schema.name;
  };

  private _changed(ev: CustomEvent<{ value: Bc250CardConfig }>): void {
    const config = { ...this._config, ...ev.detail.value };
    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) return html``;
    return html`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${this._schema()}
      .computeLabel=${this._label}
      @value-changed=${this._changed}
    ></ha-form>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "bc250-card-editor": Bc250CardEditor;
  }
}
