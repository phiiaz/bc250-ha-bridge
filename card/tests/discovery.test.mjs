import { test } from "node:test";
import assert from "node:assert/strict";
import { discoverEntities } from "../.test-build/discovery.js";

const DEV = "dev1";
const display = [
  { entity_id: "sensor.bazzite_bc_250_cpu_temperature", device_id: DEV },
  { entity_id: "sensor.bazzite_bc_250_gpu_temperature", device_id: DEV },
  { entity_id: "button.bazzite_bc_250_shut_down", device_id: DEV },
  { entity_id: "button.bazzite_bc_250_advanced_reset_gpu_clock_range", device_id: DEV },
  { entity_id: "number.bazzite_bc_250_advanced_gpu_max_clock", device_id: DEV },
  { entity_id: "sensor.other_cpu_temperature", device_id: "other" },
];

test("falls back to entity-id slugs without unique_id", () => {
  const m = discoverEntities(display, DEV);
  assert.equal(m.cpu_temp, "sensor.bazzite_bc_250_cpu_temperature");
  assert.equal(m.shutdown, "button.bazzite_bc_250_shut_down");
  assert.equal(m.gpu_reset, "button.bazzite_bc_250_advanced_reset_gpu_clock_range");
  assert.equal(m.gpu_max_clock, "number.bazzite_bc_250_advanced_gpu_max_clock");
  assert.equal(m.nvme_temp, undefined);
});

test("ignores entities of other devices", () => {
  const m = discoverEntities(display, "other");
  assert.equal(m.cpu_temp, "sensor.other_cpu_temperature");
  assert.equal(m.gpu_temp, undefined);
});

test("prefers unique_id so renamed entities are still found", () => {
  const m = discoverEntities(
    [
      { entity_id: "sensor.my_renamed_cpu", device_id: DEV, unique_id: "bazzite_cpu_temp" },
      { entity_id: "button.my_reset", device_id: DEV, unique_id: "bazzite_btn_gpu_reset" },
      { entity_id: "number.my_max", device_id: DEV, unique_id: "bazzite_num_gpu_max_clock" },
    ],
    DEV,
  );
  assert.equal(m.cpu_temp, "sensor.my_renamed_cpu");
  assert.equal(m.gpu_reset, "button.my_reset");
  assert.equal(m.gpu_max_clock, "number.my_max");
});

test("handles _2 duplicate suffix", () => {
  const m = discoverEntities([{ entity_id: "sensor.bazzite_bc_250_cpu_temperature_2", device_id: DEV }], DEV);
  assert.equal(m.cpu_temp, "sensor.bazzite_bc_250_cpu_temperature_2");
});
