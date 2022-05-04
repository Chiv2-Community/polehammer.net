import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 21],
  [Metric.DURATION_OVERHEAD, 18],
  [Metric.DURATION_STAB, 20],
  [Metric.DURATION_SPECIAL, 30],

  [Metric.RANGE_HORIZONTAL, 17],
  [Metric.RANGE_ALT_HORIZONTAL, 17],
  [Metric.RANGE_OVERHEAD, 16],
  [Metric.RANGE_ALT_OVERHEAD, 17],
  [Metric.RANGE_STAB, 20],
  [Metric.RANGE_ALT_STAB, 21],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 50],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 55],
  [Metric.DAMAGE_STAB_LIGHT, 35],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 65],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 65],
  [Metric.DAMAGE_STAB_HEAVY, 50],
  [Metric.DAMAGE_SPECIAL, 75],
]);

export default metrics;
