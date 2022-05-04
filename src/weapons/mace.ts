import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 19],
  [Metric.DURATION_OVERHEAD, 17],
  [Metric.DURATION_STAB, 18],
  [Metric.DURATION_SPECIAL, 29],

  [Metric.RANGE_HORIZONTAL, 19],
  [Metric.RANGE_ALT_HORIZONTAL, 20],
  [Metric.RANGE_OVERHEAD, 17],
  [Metric.RANGE_ALT_OVERHEAD, 19],
  [Metric.RANGE_STAB, 22],
  [Metric.RANGE_ALT_STAB, 23],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 40],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 40],
  [Metric.DAMAGE_STAB_LIGHT, 35],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 55],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 60],
  [Metric.DAMAGE_STAB_HEAVY, 45],
  [Metric.DAMAGE_SPECIAL, 65],
]);

export default metrics;
