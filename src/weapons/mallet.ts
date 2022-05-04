import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 21],
  [Metric.DURATION_OVERHEAD, 19],
  [Metric.DURATION_STAB, 21],
  [Metric.DURATION_SPECIAL, 28],

  [Metric.RANGE_HORIZONTAL, 13],
  [Metric.RANGE_ALT_HORIZONTAL, 14],
  [Metric.RANGE_OVERHEAD, 10],
  [Metric.RANGE_ALT_OVERHEAD, 12],
  [Metric.RANGE_STAB, 10],
  [Metric.RANGE_ALT_STAB, 11],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 35],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 40],
  [Metric.DAMAGE_STAB_LIGHT, 35],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 50],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 50],
  [Metric.DAMAGE_STAB_HEAVY, 45],
  [Metric.DAMAGE_SPECIAL, 50],
]);

export default metrics;
