import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 21],
  [Metric.DURATION_OVERHEAD, 17],
  [Metric.DURATION_STAB, 19],
  [Metric.DURATION_SPECIAL, 33],

  [Metric.RANGE_HORIZONTAL, 16],
  [Metric.RANGE_ALT_HORIZONTAL, 17],
  [Metric.RANGE_OVERHEAD, 15],
  [Metric.RANGE_ALT_OVERHEAD, 16],
  [Metric.RANGE_STAB, 19],
  [Metric.RANGE_ALT_STAB, 20],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 50],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 50],
  [Metric.DAMAGE_STAB_LIGHT, 30],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 70],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 70],
  [Metric.DAMAGE_STAB_HEAVY, 45],
  [Metric.DAMAGE_SPECIAL, 80],
]);

export default metrics;
