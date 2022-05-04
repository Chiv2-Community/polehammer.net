import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 21],
  [Metric.DURATION_OVERHEAD, 19],
  [Metric.DURATION_STAB, 18],
  [Metric.DURATION_SPECIAL, 30],

  [Metric.RANGE_HORIZONTAL, 16],
  [Metric.RANGE_ALT_HORIZONTAL, 16],
  [Metric.RANGE_OVERHEAD, 18],
  [Metric.RANGE_ALT_OVERHEAD, 13],
  [Metric.RANGE_STAB, 18],
  [Metric.RANGE_ALT_STAB, 18],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 30],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 45],
  [Metric.DAMAGE_STAB_LIGHT, 45],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 50],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 65],
  [Metric.DAMAGE_STAB_HEAVY, 55],
  [Metric.DAMAGE_SPECIAL, 70],
]);

export default metrics;
