import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 21],
  [Metric.DURATION_OVERHEAD, 19],
  [Metric.DURATION_STAB, 20],
  [Metric.DURATION_SPECIAL, 33],

  [Metric.RANGE_HORIZONTAL, 18],
  [Metric.RANGE_ALT_HORIZONTAL, 18],
  [Metric.RANGE_OVERHEAD, 18],
  [Metric.RANGE_ALT_OVERHEAD, 13],
  [Metric.RANGE_STAB, 16],
  [Metric.RANGE_ALT_STAB, 16],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 40],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 50],
  [Metric.DAMAGE_STAB_LIGHT, 30],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 60],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 70],
  [Metric.DAMAGE_STAB_HEAVY, 45],
  [Metric.DAMAGE_SPECIAL, 60],
]);

export default metrics;
