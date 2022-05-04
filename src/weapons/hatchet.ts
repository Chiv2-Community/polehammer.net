import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 19],
  [Metric.DURATION_OVERHEAD, 17],
  [Metric.DURATION_STAB, 20],
  [Metric.DURATION_SPECIAL, 27],

  [Metric.RANGE_HORIZONTAL, 11],
  [Metric.RANGE_ALT_HORIZONTAL, 12],
  [Metric.RANGE_OVERHEAD, 10],
  [Metric.RANGE_ALT_OVERHEAD, 12],
  [Metric.RANGE_STAB, 14],
  [Metric.RANGE_ALT_STAB, 16],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 40],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 55],
  [Metric.DAMAGE_STAB_LIGHT, 30],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 60],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 70],
  [Metric.DAMAGE_STAB_HEAVY, 40],
  [Metric.DAMAGE_SPECIAL, 60],
]);

export default metrics;
