import { MetricPath } from "../metrics";

const metrics: Map<MetricPath, number> = new Map([
  [MetricPath.WINDUP_HORIZONTAL, 17],
  [MetricPath.WINDUP_OVERHEAD, 15],
  [MetricPath.WINDUP_STAB, 19],
  [MetricPath.WINDUP_SPECIAL, 23],

  [MetricPath.RANGE_HORIZONTAL, 11],
  [MetricPath.RANGE_ALT_HORIZONTAL, 12],
  [MetricPath.RANGE_OVERHEAD, 10],
  [MetricPath.RANGE_ALT_OVERHEAD, 12],
  [MetricPath.RANGE_STAB, 14],
  [MetricPath.RANGE_ALT_STAB, 16],

  [MetricPath.DAMAGE_HORIZONTAL_LIGHT, 35],
  [MetricPath.DAMAGE_OVERHEAD_LIGHT, 45],
  [MetricPath.DAMAGE_STAB_LIGHT, 40],
  [MetricPath.DAMAGE_HORIZONTAL_HEAVY, 45],
  [MetricPath.DAMAGE_OVERHEAD_HEAVY, 55],
  [MetricPath.DAMAGE_STAB_HEAVY, 50],
  [MetricPath.DAMAGE_SPECIAL, 60],
]);

export default metrics;
