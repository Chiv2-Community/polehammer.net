import { MetricPath } from "../metrics";

const metrics = new Map([
  [MetricPath.WINDUP_HORIZONTAL, 22],
  [MetricPath.WINDUP_OVERHEAD, 22],
  [MetricPath.WINDUP_STAB, 21],
  [MetricPath.WINDUP_SPECIAL, 30],

  [MetricPath.RANGE_HORIZONTAL, 23],
  [MetricPath.RANGE_ALT_HORIZONTAL, 23],
  [MetricPath.RANGE_OVERHEAD, 22],
  [MetricPath.RANGE_ALT_OVERHEAD, 23],
  [MetricPath.RANGE_STAB, 26],
  [MetricPath.RANGE_ALT_STAB, 27],

  [MetricPath.DAMAGE_HORIZONTAL_LIGHT, 40],
  [MetricPath.DAMAGE_OVERHEAD_LIGHT, 50],
  [MetricPath.DAMAGE_STAB_LIGHT, 50],
  [MetricPath.DAMAGE_HORIZONTAL_HEAVY, 60],
  [MetricPath.DAMAGE_OVERHEAD_HEAVY, 70],
  [MetricPath.DAMAGE_STAB_HEAVY, 65],
  [MetricPath.DAMAGE_SPECIAL, 80],
]);

export default metrics;
