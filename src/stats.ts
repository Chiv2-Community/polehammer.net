import {
  AggregateInverseMetric,
  AggregateMetric,
  BasicMetric,
  InverseMetric,
  LabelledMetrics,
  MetricLabel,
  MetricPath,
  RANGE_METRICS,
  SPEED_METRICS,
} from "./metrics";
import { Target } from "./target";
import { withBonusMultipliers, Weapon } from "./weapon";

export type WeaponStats = Map<string, LabelledMetrics>;

export type UnitStats = Map<MetricLabel, { min: number; max: number }>;

function average(lst: number[]) {
  if (lst.length > 0) return lst.reduce((a, b) => a + b) / lst.length;
  else return 0;
}

export function generateMetrics(inputWeapons: Weapon[], numberOfTargets: number, target: Target): WeaponStats {
  const weapons = inputWeapons.map(w => withBonusMultipliers(w, numberOfTargets, target))
  const metricGenerators = [
    // Speeds
    // Note that we invert each value within its range, because lower is better.
    new InverseMetric(
      MetricLabel.SPEED_SLASH,
      MetricPath.WINDUP_SLASH
    ),
    new InverseMetric(MetricLabel.SPEED_OVERHEAD, MetricPath.WINDUP_OVERHEAD),
    new InverseMetric(MetricLabel.SPEED_STAB, MetricPath.WINDUP_STAB),
    new InverseMetric(MetricLabel.SPEED_SPECIAL, MetricPath.WINDUP_SPECIAL),
    new AggregateInverseMetric(
      MetricLabel.SPEED_AVERAGE,
      SPEED_METRICS,
      average
    ),

    // Ranges
    new BasicMetric(MetricLabel.RANGE_SLASH, MetricPath.RANGE_SLASH),
    new BasicMetric(
      MetricLabel.RANGE_ALT_SLASH,
      MetricPath.RANGE_ALT_SLASH
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

    // Damages
    new BasicMetric(
      MetricLabel.DAMAGE_SLASH_LIGHT,
      MetricPath.DAMAGE_SLASH_LIGHT
    ),
    new BasicMetric(
      MetricLabel.DAMAGE_SLASH_HEAVY,
      MetricPath.DAMAGE_SLASH_HEAVY
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
    new BasicMetric(MetricLabel.DAMAGE_LEAP, MetricPath.DAMAGE_LEAP),
    new AggregateMetric(
      MetricLabel.DAMAGE_LIGHT_AVERAGE, 
      [MetricPath.DAMAGE_STAB_LIGHT, MetricPath.DAMAGE_OVERHEAD_LIGHT, MetricPath.DAMAGE_SLASH_LIGHT], 
      average
    ),
    new AggregateMetric(
      MetricLabel.DAMAGE_HEAVY_AVERAGE, 
      [MetricPath.DAMAGE_STAB_HEAVY, MetricPath.DAMAGE_OVERHEAD_HEAVY, MetricPath.DAMAGE_SLASH_HEAVY], 
      average
    ),
    
    new AggregateMetric(
      MetricLabel.DAMAGE_RANGED_AVERAGE, 
      [MetricPath.DAMAGE_RANGED_HEAD, MetricPath.DAMAGE_RANGED_TORSO, MetricPath.DAMAGE_RANGED_LEGS], 
      average
    ),
    new BasicMetric(MetricLabel.DAMAGE_RANGED_HEAD, MetricPath.DAMAGE_RANGED_HEAD),
    new BasicMetric(MetricLabel.DAMAGE_RANGED_TORSO, MetricPath.DAMAGE_RANGED_TORSO),
    new BasicMetric(MetricLabel.DAMAGE_RANGED_LEGS, MetricPath.DAMAGE_RANGED_LEGS),
  ];

  return new Map(
    weapons.map((w) => [
      w.name,
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
  const unitGroupStats = new Map<MetricLabel, { min: number; max: number }>();

  // Across each weapon
  for (const [_, stats] of weaponStats) {
    // Across each stat
    for (const [l, metric] of stats) {
      const existing = unitGroupStats.get(l);
      if (existing === undefined) {
        unitGroupStats.set(l, {
          min: metric.value,
          max: metric.value,
        });
      } else {
        unitGroupStats.set(l, {
          min: Math.min(existing.min, metric.value),
          max: Math.max(existing.max, metric.value),
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
