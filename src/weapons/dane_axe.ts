import { MetricPath } from "../metrics";

const metrics: Map<MetricPath, number> = new Map([
  [MetricPath.WINDUP_HORIZONTAL, 23],
  [MetricPath.WINDUP_OVERHEAD, 19],
  [MetricPath.WINDUP_STAB, 23],
  [MetricPath.WINDUP_SPECIAL, 31],

  [MetricPath.RANGE_HORIZONTAL, 21],
  [MetricPath.RANGE_ALT_HORIZONTAL, 21],
  [MetricPath.RANGE_OVERHEAD, 20],
  [MetricPath.RANGE_ALT_OVERHEAD, 16],
  [MetricPath.RANGE_STAB, 19],
  [MetricPath.RANGE_ALT_STAB, 19],

  [MetricPath.DAMAGE_HORIZONTAL_LIGHT, 50],
  [MetricPath.DAMAGE_OVERHEAD_LIGHT, 60],
  [MetricPath.DAMAGE_STAB_LIGHT, 40],
  [MetricPath.DAMAGE_HORIZONTAL_HEAVY, 70],
  [MetricPath.DAMAGE_OVERHEAD_HEAVY, 80],
  [MetricPath.DAMAGE_STAB_HEAVY, 60],
  [MetricPath.DAMAGE_SPECIAL, 85],
]);

export default metrics;
