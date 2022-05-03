import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 25],
  [Metric.DURATION_OVERHEAD, 26],
  [Metric.DURATION_STAB, 22],
  [Metric.DURATION_SPECIAL, 38],

  [Metric.RANGE_HORIZONTAL, 26],
  [Metric.RANGE_ALT_HORIZONTAL, 25],
  [Metric.RANGE_OVERHEAD, 26],
  [Metric.RANGE_ALT_OVERHEAD, 27],
  [Metric.RANGE_STAB, 28],
  [Metric.RANGE_ALT_STAB, 28],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 50],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 70],
  [Metric.DAMAGE_STAB_LIGHT, 40],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 70],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 80],
  [Metric.DAMAGE_STAB_HEAVY, 55],
  [Metric.DAMAGE_SPECIAL, 90],
]);

export default metrics;
