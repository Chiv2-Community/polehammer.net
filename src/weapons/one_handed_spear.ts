import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 21],
  [Metric.DURATION_OVERHEAD, 19],
  [Metric.DURATION_STAB, 21],
  [Metric.DURATION_SPECIAL, 32],

  [Metric.RANGE_HORIZONTAL, 29],
  [Metric.RANGE_ALT_HORIZONTAL, 30],
  [Metric.RANGE_OVERHEAD, 28],
  [Metric.RANGE_ALT_OVERHEAD, 25],
  [Metric.RANGE_STAB, 30],
  [Metric.RANGE_ALT_STAB, 34],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 40],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 30],
  [Metric.DAMAGE_STAB_LIGHT, 50],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 60],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 65],
  [Metric.DAMAGE_STAB_HEAVY, 70],
  [Metric.DAMAGE_SPECIAL, 80],
]);

export default metrics;
