import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 29],
  [Metric.DURATION_OVERHEAD, 28],
  [Metric.DURATION_STAB, 30],
  [Metric.DURATION_SPECIAL, 27],

  [Metric.RANGE_HORIZONTAL, 31],
  [Metric.RANGE_ALT_HORIZONTAL, 31],
  [Metric.RANGE_OVERHEAD, 29],
  [Metric.RANGE_ALT_OVERHEAD, 32],
  [Metric.RANGE_STAB, 26],
  [Metric.RANGE_ALT_STAB, 24],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 60],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 85],
  [Metric.DAMAGE_STAB_LIGHT, 40],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 80],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 100],
  [Metric.DAMAGE_STAB_HEAVY, 60],
  [Metric.DAMAGE_SPECIAL, 60],
]);

export default metrics;
