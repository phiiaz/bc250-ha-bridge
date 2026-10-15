import { css } from "lit";

export const cardStyles = css`
  :host {
    --bc-accent: var(--bc250-accent, var(--primary-color, #03a9f4));
    --bc-ok: #43a047;
    --bc-warn: #fb8c00;
    --bc-crit: #e53935;
    --bc-text: var(--primary-text-color, #e5e5e5);
    --bc-dim: var(--secondary-text-color, #9e9e9e);
    --bc-tile: var(--bc250-tile, rgba(127, 127, 127, 0.12));
    display: block;
  }
  ha-card {
    padding: 16px;
    background: var(--bc250-bg, var(--ha-card-background, var(--card-background-color)));
    overflow: hidden;
  }
  ha-card.glass {
    background: rgba(40, 40, 46, 0.45);
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }
  section + section {
    margin-top: 18px;
  }
  h3 {
    margin: 0 0 8px;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--bc-dim);
  }

  /* header */
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .header .title {
    font-size: 1.3rem;
    font-weight: 500;
    color: var(--bc-text);
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 0.75rem;
    background: var(--bc-tile);
    color: var(--bc-dim);
  }
  .badge .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--bc-dim);
  }
  .badge.on .dot {
    background: var(--bc-ok);
    box-shadow: 0 0 6px var(--bc-ok);
  }
  .spacer {
    flex: 1;
  }
  .meta {
    font-size: 0.85rem;
    color: var(--bc-dim);
  }
  .now {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
    padding: 10px 12px;
    border-radius: 12px;
    background: var(--bc-tile);
    color: var(--bc-text);
  }
  .now ha-icon {
    color: var(--bc-accent);
  }
  .now .label {
    font-size: 0.75rem;
    color: var(--bc-dim);
  }

  /* vitals */
  .vitals {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
    gap: 10px;
  }
  .gauge {
    position: relative;
    padding: 8px 4px 10px;
    text-align: center;
    border-radius: 14px;
    background: var(--bc-tile);
  }
  .gauge svg {
    width: 100%;
    max-width: 110px;
    transform: rotate(135deg);
  }
  .gauge .track {
    stroke: rgba(127, 127, 127, 0.25);
  }
  .gauge .arc {
    transition: stroke-dasharray 0.6s ease, stroke 0.3s;
    stroke-linecap: round;
  }
  .gauge .arc.ok {
    stroke: var(--bc-ok);
  }
  .gauge .arc.warn {
    stroke: var(--bc-warn);
  }
  .gauge .arc.crit {
    stroke: var(--bc-crit);
  }
  .gauge .value {
    position: absolute;
    left: 0;
    right: 0;
    top: 34%;
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--bc-text);
  }
  .gauge .value small {
    font-size: 0.7rem;
    color: var(--bc-dim);
  }
  .gauge .name {
    font-size: 0.78rem;
    color: var(--bc-dim);
  }

  /* history */
  .charts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 10px;
  }
  .chart {
    padding: 10px 12px;
    border-radius: 14px;
    background: var(--bc-tile);
  }
  .chart .ctitle {
    font-size: 0.8rem;
    color: var(--bc-dim);
    margin-bottom: 4px;
  }
  .chart svg {
    width: 100%;
    height: 70px;
    display: block;
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 4px;
    font-size: 0.72rem;
    color: var(--bc-dim);
  }
  .legend i {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 2px;
    margin-right: 4px;
  }

  /* system tiles */
  .tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 8px;
  }
  .tile {
    padding: 8px 12px;
    border-radius: 12px;
    background: var(--bc-tile);
  }
  .tile .tname {
    font-size: 0.72rem;
    color: var(--bc-dim);
  }
  .tile .tval {
    font-size: 1rem;
    color: var(--bc-text);
  }
  .bar {
    height: 4px;
    margin-top: 6px;
    border-radius: 2px;
    background: rgba(127, 127, 127, 0.25);
    overflow: hidden;
  }
  .bar > div {
    height: 100%;
    background: var(--bc-accent);
    transition: width 0.6s ease;
  }
  .bar.warn > div {
    background: var(--bc-warn);
  }
  .bar.crit > div {
    background: var(--bc-crit);
  }

  /* actions */
  .actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(92px, 1fr));
    gap: 8px;
  }
  button.act {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 6px;
    border: none;
    border-radius: 12px;
    font: inherit;
    font-size: 0.78rem;
    cursor: pointer;
    color: var(--bc-text);
    background: var(--bc-tile);
    transition: background 0.2s, transform 0.1s;
  }
  button.act:hover:not([disabled]) {
    background: color-mix(in srgb, var(--c, var(--bc-accent)) 25%, transparent);
  }
  button.act:active:not([disabled]) {
    transform: scale(0.97);
  }
  button.act ha-icon {
    color: var(--c, var(--bc-accent));
  }
  button.act[disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }
  button.act.sent {
    outline: 2px solid var(--bc-ok);
  }
  button.act.failed {
    outline: 2px solid var(--bc-crit);
  }

  /* off state: data is stale and locked, only Wake stays live */
  section.dim {
    opacity: 0.4;
    filter: grayscale(0.8);
    pointer-events: none;
    user-select: none;
    transition: opacity 0.3s, filter 0.3s;
  }
  .now.off-banner {
    border: 1px dashed var(--bc-dim);
  }
  .now.off-banner ha-icon {
    color: var(--bc-dim);
  }
  button.act.pulse {
    outline: 2px solid var(--c);
    animation: bc-pulse 1.8s ease-in-out infinite;
  }
  @keyframes bc-pulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 color-mix(in srgb, var(--c) 55%, transparent);
    }
    50% {
      box-shadow: 0 0 0 8px transparent;
    }
  }
  .adv-toggle[disabled] {
    cursor: not-allowed;
  }

  /* advanced */
  .adv-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    color: var(--bc-warn);
  }
  .adv {
    margin-top: 10px;
    padding: 12px;
    border-radius: 14px;
    border: 1px solid color-mix(in srgb, var(--bc-crit) 50%, transparent);
    background: color-mix(in srgb, var(--bc-crit) 8%, transparent);
  }
  .adv p {
    margin: 0 0 10px;
    font-size: 0.8rem;
    color: var(--bc-dim);
  }
  .clock-row {
    display: grid;
    grid-template-columns: 90px 1fr auto;
    align-items: center;
    gap: 8px;
    margin: 6px 0;
    font-size: 0.85rem;
    color: var(--bc-text);
  }
  .clock-row input[type="number"] {
    width: 84px;
    padding: 4px 6px;
    border-radius: 8px;
    border: 1px solid var(--divider-color, #555);
    background: transparent;
    color: var(--bc-text);
    font: inherit;
  }
  .clock-row input[type="range"] {
    width: 100%;
    accent-color: var(--bc-warn);
  }
  .err {
    color: var(--bc-crit);
    font-size: 0.75rem;
  }
  .row-btns {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }
  button.pill {
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid var(--divider-color, #555);
    background: transparent;
    color: var(--bc-text);
    font: inherit;
    font-size: 0.8rem;
    cursor: pointer;
  }
  button.pill.primary {
    background: var(--bc-warn);
    border-color: var(--bc-warn);
    color: #111;
  }
  button.pill[disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* confirm + messages */
  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.55);
    z-index: 5;
    padding: 16px;
  }
  .dialog {
    max-width: 320px;
    padding: 16px;
    border-radius: 16px;
    background: var(--card-background-color, #222);
    color: var(--bc-text);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  }
  .dialog p {
    margin: 0 0 14px;
  }
  .message {
    padding: 16px;
    color: var(--bc-dim);
    text-align: center;
  }
  ha-card {
    position: relative;
  }
`;
