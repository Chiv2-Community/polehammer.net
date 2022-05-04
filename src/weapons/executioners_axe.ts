import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 25],
  [Metric.DURATION_OVERHEAD, 22],
  [Metric.DURATION_STAB, 23],
  [Metric.DURATION_SPECIAL, 37],

  [Metric.RANGE_HORIZONTAL, 27],
  [Metric.RANGE_ALT_HORIZONTAL, 27],
  [Metric.RANGE_OVERHEAD, 24],
  [Metric.RANGE_ALT_OVERHEAD, 21],
  [Metric.RANGE_STAB, 26],
  [Metric.RANGE_ALT_STAB, 26],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 45],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 60],
  [Metric.DAMAGE_STAB_LIGHT, 30],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 70],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 70],
  [Metric.DAMAGE_STAB_HEAVY, 50],
  [Metric.DAMAGE_SPECIAL, 80],
]);

export default metrics;
