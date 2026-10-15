import { test } from "node:test";
import assert from "node:assert/strict";
import { validateClock, snapClock } from "../.test-build/clock.js";
import { severity, formatUptime, toNumber, fraction } from "../.test-build/format.js";
import { parseHistory, downsample, buildPath } from "../.test-build/history.js";

const lim = { min: 1000, max: 2200, step: 50 };

test("clock: range, step and order checks mirror publisher.py", () => {
  assert.equal(validateClock("Max", 2000, lim, 1000, 2000).ok, true);
  assert.equal(validateClock("Max", 2250, lim, 1000, 2000).reason, "range");
  assert.equal(validateClock("Max", 975, lim, 1000, 2000).reason, "range");
  assert.equal(validateClock("Max", 1525, lim, 1000, 2000).reason, "step");
  assert.equal(validateClock("Max", 1100, lim, 1200, 2000).reason, "order");
  assert.equal(validateClock("Min", 1600, lim, 1000, 1500).reason, "order");
  assert.equal(validateClock("Min", NaN, lim, 1000, 1500).reason, "nan");
});

test("clock: snap clamps and rounds to step", () => {
  assert.equal(snapClock(1537, lim), 1550);
  assert.equal(snapClock(5000, lim), 2200);
  assert.equal(snapClock(10, lim), 1000);
});

test("format helpers", () => {
  assert.equal(severity(60, 70, 85), "ok");
  assert.equal(severity(70, 70, 85), "warn");
  assert.equal(severity(90, 70, 85), "crit");
  assert.equal(severity(undefined, 70, 85), "ok");
  assert.equal(formatUptime(2403), "40m");
  assert.equal(formatUptime(90000), "1d 1h");
  assert.equal(toNumber("unavailable"), undefined);
  assert.equal(toNumber("12.5"), 12.5);
  assert.equal(fraction(50, 0, 100), 0.5);
  assert.equal(fraction(500, 0, 100), 1);
});

test("history: parses minimal response and skips bad states", () => {
  const pts = parseHistory([
    { s: "30.5", lu: 100 },
    { s: "unavailable", lu: 110 },
    { s: "31", lu: 120 },
    { s: "x", lu: 130 },
  ]);
  assert.deepEqual(pts, [
    { t: 100000, v: 30.5 },
    { t: 120000, v: 31 },
  ]);
});

test("history: downsample caps size and keeps peaks", () => {
  const pts = Array.from({ length: 1000 }, (_, i) => ({ t: i, v: i === 500 ? 99 : 1 }));
  const out = downsample(pts, 100);
  assert.ok(out.length <= 100);
  assert.ok(out.some((p) => p.v === 99));
});

test("history: path building", () => {
  const o = { width: 100, height: 50, tMin: 0, tMax: 10, vMin: 0, vMax: 10 };
  assert.equal(buildPath([{ t: 0, v: 0 }], o), "");
  assert.equal(
    buildPath(
      [
        { t: 0, v: 0 },
        { t: 10, v: 10 },
      ],
      o,
    ),
    "M0.0,50.0L100.0,0.0",
  );
});
