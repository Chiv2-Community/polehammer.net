import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 17],
  [Metric.DURATION_OVERHEAD, 17],
  [Metric.DURATION_STAB, 19],
  [Metric.DURATION_SPECIAL, 36],

  [Metric.RANGE_HORIZONTAL, 12],
  [Metric.RANGE_ALT_HORIZONTAL, 14],
  [Metric.RANGE_OVERHEAD, 12],
  [Metric.RANGE_ALT_OVERHEAD, 13],
  [Metric.RANGE_STAB, 17],
  [Metric.RANGE_ALT_STAB, 19],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 30],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 40],
  [Metric.DAMAGE_STAB_LIGHT, 50],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 40],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 50],
  [Metric.DAMAGE_STAB_HEAVY, 70],
  [Metric.DAMAGE_SPECIAL, 100],
]);

export default metrics;
