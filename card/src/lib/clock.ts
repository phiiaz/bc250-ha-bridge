/**
 * Client-side mirror of publisher.py's clock checks. This is only for UX: the bridge
 * validates again and remains the authority.
 */
export interface ClockLimits {
  min: number;
  max: number;
  step: number;
}

export type ClockResult = { ok: true; value: number } | { ok: false; reason: "range" | "step" | "order" | "nan" };

/** Snap to the nearest valid step inside the limits. */
export function snapClock(value: number, lim: ClockLimits): number {
  const snapped = Math.round(value / lim.step) * lim.step;
  return Math.min(lim.max, Math.max(lim.min, snapped));
}

export function validateClock(
  prop: "Max" | "Min",
  value: number,
  lim: ClockLimits,
  currentMin: number | undefined,
  currentMax: number | undefined,
): ClockResult {
  if (!Number.isFinite(value)) return { ok: false, reason: "nan" };
  if (value < lim.min || value > lim.max) return { ok: false, reason: "range" };
  if (value % lim.step !== 0) return { ok: false, reason: "step" };
  if (prop === "Max" && currentMin !== undefined && value < currentMin) return { ok: false, reason: "order" };
  if (prop === "Min" && currentMax !== undefined && value > currentMax) return { ok: false, reason: "order" };
  return { ok: true, value };
}
