import { MetricPath } from "../metrics";

const metrics = new Map([
  [MetricPath.WINDUP_HORIZONTAL, 19],
  [MetricPath.WINDUP_OVERHEAD, 17],
  [MetricPath.WINDUP_STAB, 20],
  [MetricPath.WINDUP_SPECIAL, 28],

  [MetricPath.RANGE_HORIZONTAL, 22],
  [MetricPath.RANGE_ALT_HORIZONTAL, 23],
  [MetricPath.RANGE_OVERHEAD, 22],
  [MetricPath.RANGE_ALT_OVERHEAD, 23],
  [MetricPath.RANGE_STAB, 25],
  [MetricPath.RANGE_ALT_STAB, 27],

  [MetricPath.DAMAGE_HORIZONTAL_LIGHT, 40],
  [MetricPath.DAMAGE_OVERHEAD_LIGHT, 50],
  [MetricPath.DAMAGE_STAB_LIGHT, 45],
  [MetricPath.DAMAGE_HORIZONTAL_HEAVY, 60],
  [MetricPath.DAMAGE_OVERHEAD_HEAVY, 65],
  [MetricPath.DAMAGE_STAB_HEAVY, 60],
  [MetricPath.DAMAGE_SPECIAL, 70],
]);

export default metrics;
