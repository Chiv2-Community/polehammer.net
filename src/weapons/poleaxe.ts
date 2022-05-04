import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 24],
  [Metric.DURATION_OVERHEAD, 20],
  [Metric.DURATION_STAB, 23],
  [Metric.DURATION_SPECIAL, 37],

  [Metric.RANGE_HORIZONTAL, 26],
  [Metric.RANGE_ALT_HORIZONTAL, 20],
  [Metric.RANGE_OVERHEAD, 28],
  [Metric.RANGE_ALT_OVERHEAD, 28],
  [Metric.RANGE_STAB, 27],
  [Metric.RANGE_ALT_STAB, 29],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 40],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 50],
  [Metric.DAMAGE_STAB_LIGHT, 50],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 55],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 70],
  [Metric.DAMAGE_STAB_HEAVY, 70],
  [Metric.DAMAGE_SPECIAL, 70],
]);

export default metrics;
