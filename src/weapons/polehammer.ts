import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 24],
  [Metric.DURATION_OVERHEAD, 21],
  [Metric.DURATION_STAB, 23],
  [Metric.DURATION_SPECIAL, 40],

  [Metric.RANGE_HORIZONTAL, 28],
  [Metric.RANGE_ALT_HORIZONTAL, 23],
  [Metric.RANGE_OVERHEAD, 30],
  [Metric.RANGE_ALT_OVERHEAD, 30],
  [Metric.RANGE_STAB, 30],
  [Metric.RANGE_ALT_STAB, 32],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 45],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 50],
  [Metric.DAMAGE_STAB_LIGHT, 40],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 60],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 70],
  [Metric.DAMAGE_STAB_HEAVY, 60],
  [Metric.DAMAGE_SPECIAL, 100],
]);

export default metrics;
