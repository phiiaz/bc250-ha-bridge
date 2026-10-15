export interface Point {
  t: number; // epoch ms
  v: number;
}

/** Parse the response of `history/history_during_period` (minimal_response + no_attributes). */
export function parseHistory(raw: unknown): Point[] {
  if (!Array.isArray(raw)) return [];
  const pts: Point[] = [];
  for (const item of raw as Array<Record<string, unknown>>) {
    const state = (item.s ?? item.state) as string | undefined;
    const v = Number(state);
    if (state === undefined || state === "unknown" || state === "unavailable" || !Number.isFinite(v)) continue;
    let t: number | undefined;
    if (typeof item.lu === "number") t = item.lu * 1000;
    else if (typeof item.lc === "number") t = item.lc * 1000;
    else if (typeof item.last_updated === "string") t = Date.parse(item.last_updated);
    if (t === undefined || !Number.isFinite(t)) continue;
    pts.push({ t, v });
  }
  return pts;
}

/** Reduce to at most `max` points by bucketed averaging (keeps spikes visible via max). */
export function downsample(points: Point[], max: number): Point[] {
  if (points.length <= max) return points;
  const size = points.length / max;
  const out: Point[] = [];
  for (let i = 0; i < max; i++) {
    const bucket = points.slice(Math.floor(i * size), Math.floor((i + 1) * size));
    if (!bucket.length) continue;
    const peak = bucket.reduce((a, b) => (b.v > a.v ? b : a));
    out.push({ t: bucket[Math.floor(bucket.length / 2)].t, v: peak.v });
  }
  return out;
}

export interface PathOptions {
  width: number;
  height: number;
  tMin: number;
  tMax: number;
  vMin: number;
  vMax: number;
}

/** SVG path `d` for a polyline. Returns "" with fewer than two points. */
export function buildPath(points: Point[], o: PathOptions): string {
  if (points.length < 2) return "";
  const dt = o.tMax - o.tMin || 1;
  const dv = o.vMax - o.vMin || 1;
  return points
    .map((p, i) => {
      const x = ((p.t - o.tMin) / dt) * o.width;
      const y = o.height - ((p.v - o.vMin) / dv) * o.height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join("");
}
