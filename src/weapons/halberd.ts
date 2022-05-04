import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 26],
  [Metric.DURATION_OVERHEAD, 22],
  [Metric.DURATION_STAB, 26],
  [Metric.DURATION_SPECIAL, 39],

  [Metric.RANGE_HORIZONTAL, 33],
  [Metric.RANGE_ALT_HORIZONTAL, 27],
  [Metric.RANGE_OVERHEAD, 35],
  [Metric.RANGE_ALT_OVERHEAD, 35],
  [Metric.RANGE_STAB, 34],
  [Metric.RANGE_ALT_STAB, 36],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 45],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 60],
  [Metric.DAMAGE_STAB_LIGHT, 55],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 60],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 70],
  [Metric.DAMAGE_STAB_HEAVY, 70],
  [Metric.DAMAGE_SPECIAL, 80],
]);

export default metrics;
