import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 27],
  [Metric.DURATION_OVERHEAD, 25],
  [Metric.DURATION_STAB, 24],
  [Metric.DURATION_SPECIAL, 39],

  [Metric.RANGE_HORIZONTAL, 31],
  [Metric.RANGE_ALT_HORIZONTAL, 26],
  [Metric.RANGE_OVERHEAD, 27],
  [Metric.RANGE_ALT_OVERHEAD, 30],
  [Metric.RANGE_STAB, 26],
  [Metric.RANGE_ALT_STAB, 28],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 50],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 70],
  [Metric.DAMAGE_STAB_LIGHT, 50],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 70],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 90],
  [Metric.DAMAGE_STAB_HEAVY, 70],
  [Metric.DAMAGE_SPECIAL, 100],
]);

export default metrics;
