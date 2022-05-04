import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 25],
  [Metric.DURATION_OVERHEAD, 22],
  [Metric.DURATION_STAB, 24],
  [Metric.DURATION_SPECIAL, 37],

  [Metric.RANGE_HORIZONTAL, 25],
  [Metric.RANGE_ALT_HORIZONTAL, 25],
  [Metric.RANGE_OVERHEAD, 23],
  [Metric.RANGE_ALT_OVERHEAD, 20],
  [Metric.RANGE_STAB, 23],
  [Metric.RANGE_ALT_STAB, 23],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 50],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 60],
  [Metric.DAMAGE_STAB_LIGHT, 35],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 70],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 80],
  [Metric.DAMAGE_STAB_HEAVY, 55],
  [Metric.DAMAGE_SPECIAL, 90],
]);

export default metrics;
