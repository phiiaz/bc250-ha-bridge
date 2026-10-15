export type Severity = "ok" | "warn" | "crit";

export function toNumber(state: string | undefined): number | undefined {
  if (state === undefined || state === "unknown" || state === "unavailable" || state === "") return undefined;
  const n = Number(state);
  return Number.isFinite(n) ? n : undefined;
}

export function severity(value: number | undefined, warn: number, crit: number): Severity {
  if (value === undefined) return "ok";
  if (value >= crit) return "crit";
  if (value >= warn) return "warn";
  return "ok";
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

/** 0..1 position of v inside [lo, hi]. */
export function fraction(v: number | undefined, lo: number, hi: number): number {
  if (v === undefined || hi <= lo) return 0;
  return clamp((v - lo) / (hi - lo), 0, 1);
}

export function formatUptime(seconds: number | undefined): string {
  if (seconds === undefined) return "–";
  const s = Math.floor(seconds);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatValue(v: number | undefined, digits = 0): string {
  return v === undefined ? "–" : v.toFixed(digits);
}
