import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 21],
  [Metric.DURATION_OVERHEAD, 21],
  [Metric.DURATION_STAB, 22],
  [Metric.DURATION_SPECIAL, 32],

  [Metric.RANGE_HORIZONTAL, 30],
  [Metric.RANGE_ALT_HORIZONTAL, 30],
  [Metric.RANGE_OVERHEAD, 27],
  [Metric.RANGE_ALT_OVERHEAD, 25],
  [Metric.RANGE_STAB, 29],
  [Metric.RANGE_ALT_STAB, 29],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 30],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 45],
  [Metric.DAMAGE_STAB_LIGHT, 35],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 50],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 60],
  [Metric.DAMAGE_STAB_HEAVY, 45],
  [Metric.DAMAGE_SPECIAL, 65],
]);

export default metrics;
