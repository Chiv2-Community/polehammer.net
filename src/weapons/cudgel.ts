import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 17],
  [Metric.DURATION_OVERHEAD, 17],
  [Metric.DURATION_STAB, 19],
  [Metric.DURATION_SPECIAL, 28],

  [Metric.RANGE_HORIZONTAL, 15],
  [Metric.RANGE_ALT_HORIZONTAL, 16],
  [Metric.RANGE_OVERHEAD, 13],
  [Metric.RANGE_ALT_OVERHEAD, 15],
  [Metric.RANGE_STAB, 18],
  [Metric.RANGE_ALT_STAB, 20],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 30],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 30],
  [Metric.DAMAGE_STAB_LIGHT, 25],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 45],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 45],
  [Metric.DAMAGE_STAB_HEAVY, 35],
  [Metric.DAMAGE_SPECIAL, 55],
]);

export default metrics;
