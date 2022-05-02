import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 19],
  [Metric.DURATION_OVERHEAD, 15],
  [Metric.DURATION_STAB, 19],
  [Metric.DURATION_SPECIAL, 21],

  [Metric.RANGE_HORIZONTAL, 22],
  [Metric.RANGE_ALT_HORIZONTAL, 21],
  [Metric.RANGE_OVERHEAD, 21],
  [Metric.RANGE_ALT_OVERHEAD, 22],
  [Metric.RANGE_STAB, 25],
  [Metric.RANGE_ALT_STAB, 26],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 30],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 35],
  [Metric.DAMAGE_STAB_LIGHT, 50],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 50],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 55],
  [Metric.DAMAGE_STAB_HEAVY, 70],
  [Metric.DAMAGE_SPECIAL, 55],
]);

export default metrics;
