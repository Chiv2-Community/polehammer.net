import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 27],
  [Metric.DURATION_OVERHEAD, 25],
  [Metric.DURATION_STAB, 24],
  [Metric.DURATION_SPECIAL, 45],

  [Metric.RANGE_HORIZONTAL, 22],
  [Metric.RANGE_ALT_HORIZONTAL, 22],
  [Metric.RANGE_OVERHEAD, 21],
  [Metric.RANGE_ALT_OVERHEAD, 21],
  [Metric.RANGE_STAB, 20],
  [Metric.RANGE_ALT_STAB, 20],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 50],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 60],
  [Metric.DAMAGE_STAB_LIGHT, 30],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 70],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 80],
  [Metric.DAMAGE_STAB_HEAVY, 40],
  [Metric.DAMAGE_SPECIAL, 120],
]);

export default metrics;
