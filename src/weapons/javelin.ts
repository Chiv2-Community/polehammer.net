import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 21],
  [Metric.DURATION_OVERHEAD, 20],
  [Metric.DURATION_STAB, 21],
  [Metric.DURATION_SPECIAL, 26],

  [Metric.RANGE_HORIZONTAL, 28],
  [Metric.RANGE_ALT_HORIZONTAL, 29],
  [Metric.RANGE_OVERHEAD, 26],
  [Metric.RANGE_ALT_OVERHEAD, 23],
  [Metric.RANGE_STAB, 29],
  [Metric.RANGE_ALT_STAB, 33],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 30],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 35],
  [Metric.DAMAGE_STAB_LIGHT, 40],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 50],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 55],
  [Metric.DAMAGE_STAB_HEAVY, 60],
  [Metric.DAMAGE_SPECIAL, 50],
]);

export default metrics;
