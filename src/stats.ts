import {
  AggregateInverseMetric,
  AggregateMetric,
  BasicMetric,
  DAMAGE_METRICS,
  InverseMetric,
  LabelledMetrics,
  MetricLabel,
  MetricPath,
  RANGE_METRICS,
  SPEED_METRICS,
  Unit,
} from "./metrics";
import { maxPossibleBonus as maxPossibleDamageBonus, Weapon } from "./weapon";

export type WeaponStats = Map<Weapon, LabelledMetrics>;

export type UnitStats = Map<Unit, { min: number; max: number }>;

function average(lst: number[]) {
  if (lst.length > 0) return lst.reduce((a, b) => a + b) / lst.length;
  else return 0;
}

export function generateMetrics(weapons: Weapon[]): WeaponStats {
  const metricGenerators = [
    // Speeds
    // Note that we invert each value within its range, because lower is better.
    new InverseMetric(
      MetricLabel.SPEED_HORIZONTAL,
      MetricPath.WINDUP_HORIZONTAL
    ),
    new InverseMetric(MetricLabel.SPEED_OVERHEAD, MetricPath.WINDUP_OVERHEAD),
    new InverseMetric(MetricLabel.SPEED_STAB, MetricPath.WINDUP_STAB),
    new InverseMetric(MetricLabel.SPEED_SPECIAL, MetricPath.WINDUP_SPECIAL),
    new AggregateInverseMetric(
      MetricLabel.SPEED_AVERAGE,
      SPEED_METRICS,
      average
    ),
    // new AggregateInverseMetric(
    //   MetricLabel.SPEED_MAX,
    //   SPEED_METRICS,
    //   n => Math.max(...n)
    // ),

    // Ranges
    new BasicMetric(MetricLabel.RANGE_HORIZONTAL, MetricPath.RANGE_HORIZONTAL),
    new BasicMetric(
      MetricLabel.RANGE_ALT_HORIZONTAL,
      MetricPath.RANGE_ALT_HORIZONTAL
    ),
    new BasicMetric(MetricLabel.RANGE_OVERHEAD, MetricPath.RANGE_OVERHEAD),
    new BasicMetric(
      MetricLabel.RANGE_ALT_OVERHEAD,
      MetricPath.RANGE_ALT_OVERHEAD
    ),
    new BasicMetric(MetricLabel.RANGE_STAB, MetricPath.RANGE_STAB),
    new BasicMetric(MetricLabel.RANGE_ALT_STAB, MetricPath.RANGE_ALT_STAB),
    //new BasicMetric(MetricLabel.RANGE_SPECIAL, MetricPath.RANGE_SPECIAL), TODO
    new AggregateMetric(MetricLabel.RANGE_AVERAGE, RANGE_METRICS, average),
    // new AggregateMetric(MetricLabel.RANGE_MAX, RANGE_METRICS, n => Math.max(...n)),

    // Damages
    new BasicMetric(
      MetricLabel.DAMAGE_HORIZONTAL_LIGHT,
      MetricPath.DAMAGE_HORIZONTAL_LIGHT
    ),
    new BasicMetric(
      MetricLabel.DAMAGE_HORIZONTAL_HEAVY,
      MetricPath.DAMAGE_HORIZONTAL_HEAVY
    ),
    new BasicMetric(
      MetricLabel.DAMAGE_OVERHEAD_LIGHT,
      MetricPath.DAMAGE_OVERHEAD_LIGHT
    ),
    new BasicMetric(
      MetricLabel.DAMAGE_OVERHEAD_HEAVY,
      MetricPath.DAMAGE_OVERHEAD_HEAVY
    ),
    new BasicMetric(
      MetricLabel.DAMAGE_STAB_LIGHT,
      MetricPath.DAMAGE_STAB_LIGHT
    ),
    new BasicMetric(
      MetricLabel.DAMAGE_STAB_HEAVY,
      MetricPath.DAMAGE_STAB_HEAVY
    ),
    new BasicMetric(MetricLabel.DAMAGE_SPECIAL, MetricPath.DAMAGE_SPECIAL),
    new BasicMetric(MetricLabel.DAMAGE_CHARGE, MetricPath.DAMAGE_CHARGE),
    new AggregateMetric(MetricLabel.DAMAGE_AVERAGE, DAMAGE_METRICS, average),
    // new AggregateMetric(MetricLabel.DAMAGE_MAX_HEAVY, [
    //   MetricPath.DAMAGE_STAB_HEAVY,
    //   MetricPath.DAMAGE_OVERHEAD_HEAVY,
    //   MetricPath.DAMAGE_HORIZONTAL_HEAVY
    // ], x => Math.max(...x)),
    // new AggregateMetric(MetricLabel.DAMAGE_MAX_LIGHT, [
    //   MetricPath.DAMAGE_STAB_LIGHT,
    //   MetricPath.DAMAGE_OVERHEAD_LIGHT,
    //   MetricPath.DAMAGE_HORIZONTAL_LIGHT
    // ], x => Math.max(...x)),
  ];

  return new Map(
    weapons.map((w) => [
      w,
      new Map(
        metricGenerators.map((m) => [
          m.name,
          {
            value: m.calculate(w),
            unit: m.unit,
          },
        ])
      ),
    ])
  );
}

// Across given weapon stats, calculate min and max (at max possible bonus)
// values for use in normalizing results for chart display
export function unitGroupStats(weaponStats: WeaponStats) {
  const unitGroupStats = new Map<Unit, { min: number; max: number }>();

  // Across each weapon
  for (const [weapon, stats] of weaponStats) {
    // Across each stat
    for (const [, metric] of stats) {
      const existing = unitGroupStats.get(metric.unit);
      const maxPossible =
        metric.unit === Unit.DAMAGE
          ? metric.value * maxPossibleDamageBonus(weapon)
          : metric.value;
      if (existing === undefined) {
        unitGroupStats.set(metric.unit, {
          min: metric.value,
          max: maxPossible,
        });
      } else {
        unitGroupStats.set(metric.unit, {
          min: Math.min(existing.min, metric.value),
          max: Math.max(existing.max, maxPossible),
        });
      }
    }
  }

  return unitGroupStats;
}

export function hasBonus(category: MetricLabel) {
  return category.toLowerCase().includes("damage");
}

export type WeaponMetricLabels = Map<string, MetricLabel>;

// export function normalize(stats: WeaponStats): WeaponStats {
//   const normalized = new Map(stats);
//   for (const rating of Object.values(MetricLabel)) {
//     // Get min and max for this rating _across all weapons_
//     // Scale max possible damage based on weapon's damage type
//     const values: number[] = [...stats.values()].map(
//       (x: LabelledMetrics) => x.get(rating)!
//     );
//     const min = Math.min(...values);
//     const max = Math.max(...values);

//     // Scale by min and max
//     for (const [weapon, derived] of normalized) {
//       let div = 1.0;
//       if (hasBonus(rating)) {
//         div = maxPossibleBonus(weapon);
//       }
//       derived.set(rating, (derived.get(rating)! - min) / (max - min) / div);
//     }
//   }
//   return normalized;
// }
