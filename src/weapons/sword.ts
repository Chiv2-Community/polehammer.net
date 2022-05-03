import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 19],
  [Metric.DURATION_OVERHEAD, 17],
  [Metric.DURATION_STAB, 20],
  [Metric.DURATION_SPECIAL, 28],

  [Metric.RANGE_HORIZONTAL, 22],
  [Metric.RANGE_ALT_HORIZONTAL, 23],
  [Metric.RANGE_OVERHEAD, 22],
  [Metric.RANGE_ALT_OVERHEAD, 23],
  [Metric.RANGE_STAB, 25],
  [Metric.RANGE_ALT_STAB, 27],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 40],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 50],
  [Metric.DAMAGE_STAB_LIGHT, 45],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 60],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 65],
  [Metric.DAMAGE_STAB_HEAVY, 60],
  [Metric.DAMAGE_SPECIAL, 70],
]);

export default metrics;
