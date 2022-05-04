import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 19],
  [Metric.DURATION_OVERHEAD, 17],
  [Metric.DURATION_STAB, 20],
  [Metric.DURATION_SPECIAL, 26],

  [Metric.RANGE_HORIZONTAL, 20],
  [Metric.RANGE_ALT_HORIZONTAL, 21],
  [Metric.RANGE_OVERHEAD, 19],
  [Metric.RANGE_ALT_OVERHEAD, 20],
  [Metric.RANGE_STAB, 23],
  [Metric.RANGE_ALT_STAB, 24],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 35],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 40],
  [Metric.DAMAGE_STAB_LIGHT, 40],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 50],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 55],
  [Metric.DAMAGE_STAB_HEAVY, 55],
  [Metric.DAMAGE_SPECIAL, 65],
]);

export default metrics;
