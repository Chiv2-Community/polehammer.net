import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 17],
  [Metric.DURATION_OVERHEAD, 15],
  [Metric.DURATION_STAB, 19],
  [Metric.DURATION_SPECIAL, 23],

  [Metric.RANGE_HORIZONTAL, 11],
  [Metric.RANGE_ALT_HORIZONTAL, 12],
  [Metric.RANGE_OVERHEAD, 10],
  [Metric.RANGE_ALT_OVERHEAD, 12],
  [Metric.RANGE_STAB, 14],
  [Metric.RANGE_ALT_STAB, 16],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 35],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 45],
  [Metric.DAMAGE_STAB_LIGHT, 40],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 45],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 55],
  [Metric.DAMAGE_STAB_HEAVY, 50],
  [Metric.DAMAGE_SPECIAL, 60],
]);

export default metrics;
