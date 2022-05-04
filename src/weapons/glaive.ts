import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 22],
  [Metric.DURATION_OVERHEAD, 17],
  [Metric.DURATION_STAB, 26],
  [Metric.DURATION_SPECIAL, 33],

  [Metric.RANGE_HORIZONTAL, 36],
  [Metric.RANGE_ALT_HORIZONTAL, 31],
  [Metric.RANGE_OVERHEAD, 38],
  [Metric.RANGE_ALT_OVERHEAD, 38],
  [Metric.RANGE_STAB, 37],
  [Metric.RANGE_ALT_STAB, 39],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 30],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 40],
  [Metric.DAMAGE_STAB_LIGHT, 40],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 50],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 60],
  [Metric.DAMAGE_STAB_HEAVY, 60],
  [Metric.DAMAGE_SPECIAL, 60],
]);

export default metrics;
