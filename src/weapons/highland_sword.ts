import { MetricPath } from "../metrics";

const metrics = new Map([
  [MetricPath.WINDUP_HORIZONTAL, 29],
  [MetricPath.WINDUP_OVERHEAD, 28],
  [MetricPath.WINDUP_STAB, 30],
  [MetricPath.WINDUP_SPECIAL, 27],

  [MetricPath.RANGE_HORIZONTAL, 31],
  [MetricPath.RANGE_ALT_HORIZONTAL, 31],
  [MetricPath.RANGE_OVERHEAD, 29],
  [MetricPath.RANGE_ALT_OVERHEAD, 32],
  [MetricPath.RANGE_STAB, 26],
  [MetricPath.RANGE_ALT_STAB, 24],

  [MetricPath.DAMAGE_HORIZONTAL_LIGHT, 60],
  [MetricPath.DAMAGE_OVERHEAD_LIGHT, 85],
  [MetricPath.DAMAGE_STAB_LIGHT, 40],
  [MetricPath.DAMAGE_HORIZONTAL_HEAVY, 80],
  [MetricPath.DAMAGE_OVERHEAD_HEAVY, 100],
  [MetricPath.DAMAGE_STAB_HEAVY, 60],
  [MetricPath.DAMAGE_SPECIAL, 60],
]);

export default metrics;
