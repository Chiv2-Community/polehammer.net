import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 25],
  [Metric.DURATION_OVERHEAD, 24],
  [Metric.DURATION_STAB, 24],
  [Metric.DURATION_SPECIAL, 34],

  [Metric.RANGE_HORIZONTAL, 21],
  [Metric.RANGE_ALT_HORIZONTAL, 21],
  [Metric.RANGE_OVERHEAD, 20],
  [Metric.RANGE_ALT_OVERHEAD, 16],
  [Metric.RANGE_STAB, 19],
  [Metric.RANGE_ALT_STAB, 19],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 55],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 65],
  [Metric.DAMAGE_STAB_LIGHT, 40],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 75],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 85],
  [Metric.DAMAGE_STAB_HEAVY, 60],
  [Metric.DAMAGE_SPECIAL, 100],
]);

export default metrics;
