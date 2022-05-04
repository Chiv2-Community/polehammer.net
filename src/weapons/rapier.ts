import { MetricPath } from "../metrics";

const metrics = new Map([
  [MetricPath.WINDUP_HORIZONTAL, 19],
  [MetricPath.WINDUP_OVERHEAD, 15],
  [MetricPath.WINDUP_STAB, 19],
  [MetricPath.WINDUP_SPECIAL, 21],

  [MetricPath.RANGE_HORIZONTAL, 22],
  [MetricPath.RANGE_ALT_HORIZONTAL, 21],
  [MetricPath.RANGE_OVERHEAD, 21],
  [MetricPath.RANGE_ALT_OVERHEAD, 22],
  [MetricPath.RANGE_STAB, 25],
  [MetricPath.RANGE_ALT_STAB, 26],

  [MetricPath.DAMAGE_HORIZONTAL_LIGHT, 30],
  [MetricPath.DAMAGE_OVERHEAD_LIGHT, 35],
  [MetricPath.DAMAGE_STAB_LIGHT, 50],
  [MetricPath.DAMAGE_HORIZONTAL_HEAVY, 50],
  [MetricPath.DAMAGE_OVERHEAD_HEAVY, 55],
  [MetricPath.DAMAGE_STAB_HEAVY, 70],
  [MetricPath.DAMAGE_SPECIAL, 55],
]);

export default metrics;
