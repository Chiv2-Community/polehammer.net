import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 23],
  [Metric.DURATION_OVERHEAD, 19],
  [Metric.DURATION_STAB, 23],
  [Metric.DURATION_SPECIAL, 31],

  [Metric.RANGE_HORIZONTAL, 21],
  [Metric.RANGE_ALT_HORIZONTAL, 21],
  [Metric.RANGE_OVERHEAD, 20],
  [Metric.RANGE_ALT_OVERHEAD, 16],
  [Metric.RANGE_STAB, 19],
  [Metric.RANGE_ALT_STAB, 19],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 50],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 60],
  [Metric.DAMAGE_STAB_LIGHT, 40],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 70],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 80],
  [Metric.DAMAGE_STAB_HEAVY, 60],
  [Metric.DAMAGE_SPECIAL, 85],
]);

export default metrics;
