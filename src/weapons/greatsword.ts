import { MetricPath } from "../metrics";

const metrics = new Map([
  [MetricPath.WINDUP_HORIZONTAL, 27],
  [MetricPath.WINDUP_OVERHEAD, 25],
  [MetricPath.WINDUP_STAB, 24],
  [MetricPath.WINDUP_SPECIAL, 39],

  [MetricPath.RANGE_HORIZONTAL, 31],
  [MetricPath.RANGE_ALT_HORIZONTAL, 26],
  [MetricPath.RANGE_OVERHEAD, 27],
  [MetricPath.RANGE_ALT_OVERHEAD, 30],
  [MetricPath.RANGE_STAB, 26],
  [MetricPath.RANGE_ALT_STAB, 28],

  [MetricPath.DAMAGE_HORIZONTAL_LIGHT, 50],
  [MetricPath.DAMAGE_OVERHEAD_LIGHT, 70],
  [MetricPath.DAMAGE_STAB_LIGHT, 50],
  [MetricPath.DAMAGE_HORIZONTAL_HEAVY, 70],
  [MetricPath.DAMAGE_OVERHEAD_HEAVY, 90],
  [MetricPath.DAMAGE_STAB_HEAVY, 70],
  [MetricPath.DAMAGE_SPECIAL, 100],
]);

export default metrics;
