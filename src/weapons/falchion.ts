import { MetricPath } from "../metrics";

const metrics = new Map([
  [MetricPath.WINDUP_HORIZONTAL, 21],
  [MetricPath.WINDUP_OVERHEAD, 19],
  [MetricPath.WINDUP_STAB, 19],
  [MetricPath.WINDUP_SPECIAL, 29],

  [MetricPath.RANGE_HORIZONTAL, 20],
  [MetricPath.RANGE_ALT_HORIZONTAL, 21],
  [MetricPath.RANGE_OVERHEAD, 19],
  [MetricPath.RANGE_ALT_OVERHEAD, 20],
  [MetricPath.RANGE_STAB, 23],
  [MetricPath.RANGE_ALT_STAB, 24],

  [MetricPath.DAMAGE_HORIZONTAL_LIGHT, 50],
  [MetricPath.DAMAGE_OVERHEAD_LIGHT, 55],
  [MetricPath.DAMAGE_STAB_LIGHT, 40],
  [MetricPath.DAMAGE_HORIZONTAL_HEAVY, 65],
  [MetricPath.DAMAGE_OVERHEAD_HEAVY, 70],
  [MetricPath.DAMAGE_STAB_HEAVY, 60],
  [MetricPath.DAMAGE_SPECIAL, 80],
]);

export default metrics;
