import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 23],
  [Metric.DURATION_OVERHEAD, 21],
  [Metric.DURATION_STAB, 23],
  [Metric.DURATION_SPECIAL, 35],

  [Metric.RANGE_HORIZONTAL, 26],
  [Metric.RANGE_ALT_HORIZONTAL, 26],
  [Metric.RANGE_OVERHEAD, 24],
  [Metric.RANGE_ALT_OVERHEAD, 21],
  [Metric.RANGE_STAB, 24],
  [Metric.RANGE_ALT_STAB, 24],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 40],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 50],
  [Metric.DAMAGE_STAB_LIGHT, 40],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 60],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 70],
  [Metric.DAMAGE_STAB_HEAVY, 60],
  [Metric.DAMAGE_SPECIAL, 80],
]);

export default metrics;
