import ALL_WEAPONS from "./all_weapons";
import {
  AggregateInverseMetric,
  AggregateMetric,
  BasicMetric,
  InverseMetric,
  LabelledMetrics,
  MetricLabel,
  MetricPath,
} from "./metrics";
import { Target } from "./target";
import { withBonusMultipliers, Weapon } from "./weapon";

export type WeaponStats = Map<string, LabelledMetrics>;

export type UnitStats = Map<string, { min: number; max: number }>;

function average(lst: number[]) {
  if (lst.length > 0) return lst.reduce((a, b) => a + b) / lst.length;
  else return 0;
}

function calculateStatPercentile(weaponId: string, stat: string) {
  const all_weapons_copy = clone(ALL_WEAPONS)
  const weapon = weaponById(weaponId);
  if (weapon === undefined) {
    console.warn(`Invalid weapon id specified: ${weaponId}`);
    return undefined;
  }

  const statValue = extractNumber(weapon, stat);
  if (statValue === undefined) {
    console.warn(`Invalid stat ${weapon.name} path specified: ${stat}`);
    return undefined;
  }

  return statValue / 1
}

export function generateMetrics(inputWeapons: Weapon[], numberOfTargets: number, horsebackDamageMult: number, target: Target): WeaponStats {
  const weapons = inputWeapons.map(w => withBonusMultipliers(w, numberOfTargets, horsebackDamageMult, target))
  const metricGenerators = [
    // For windup and recovery, lower is better
    new InverseMetric(MetricLabel.WINDUP_SLASH_LIGHT, MetricPath.WINDUP_SLASH_LIGHT),
    new InverseMetric(MetricLabel.WINDUP_SLASH_HEAVY, MetricPath.WINDUP_SLASH_LIGHT),
    new InverseMetric(MetricLabel.WINDUP_OVERHEAD_LIGHT, MetricPath.WINDUP_SLASH_LIGHT),
    new InverseMetric(MetricLabel.WINDUP_OVERHEAD_HEAVY, MetricPath.WINDUP_SLASH_LIGHT),
    new InverseMetric(MetricLabel.WINDUP_STAB_LIGHT, MetricPath.WINDUP_SLASH_LIGHT),
    new InverseMetric(MetricLabel.WINDUP_STAB_HEAVY, MetricPath.WINDUP_SLASH_LIGHT),
    new InverseMetric(MetricLabel.WINDUP_SPECIAL, MetricPath.WINDUP_SPECIAL),
    new InverseMetric(MetricLabel.WINDUP_SPRINT, MetricPath.WINDUP_SPRINT),
    new InverseMetric(MetricLabel.WINDUP_THROW, MetricPath.WINDUP_THROW),
    new InverseMetric(MetricLabel.RECOVERY_SLASH_LIGHT, MetricPath.RECOVERY_SLASH_LIGHT),
    new InverseMetric(MetricLabel.RECOVERY_SLASH_HEAVY, MetricPath.RECOVERY_SLASH_LIGHT),
    new InverseMetric(MetricLabel.RECOVERY_OVERHEAD_LIGHT, MetricPath.RECOVERY_SLASH_LIGHT),
    new InverseMetric(MetricLabel.RECOVERY_OVERHEAD_HEAVY, MetricPath.RECOVERY_SLASH_LIGHT),
    new InverseMetric(MetricLabel.RECOVERY_STAB_LIGHT, MetricPath.RECOVERY_SLASH_LIGHT),
    new InverseMetric(MetricLabel.RECOVERY_STAB_HEAVY, MetricPath.RECOVERY_SLASH_LIGHT),
    new InverseMetric(MetricLabel.RECOVERY_SPECIAL, MetricPath.RECOVERY_SPECIAL),
    new InverseMetric(MetricLabel.RECOVERY_SPRINT, MetricPath.RECOVERY_SPRINT),
    new InverseMetric(MetricLabel.RECOVERY_THROW, MetricPath.RECOVERY_THROW),

    // For combo and release, higher is better
    new BasicMetric(MetricLabel.RELEASE_SLASH_LIGHT, MetricPath.RELEASE_SLASH_LIGHT),
    new BasicMetric(MetricLabel.RELEASE_SLASH_HEAVY, MetricPath.RELEASE_SLASH_LIGHT),
    new BasicMetric(MetricLabel.RELEASE_OVERHEAD_LIGHT, MetricPath.RELEASE_SLASH_LIGHT),
    new BasicMetric(MetricLabel.RELEASE_OVERHEAD_HEAVY, MetricPath.RELEASE_SLASH_LIGHT),
    new BasicMetric(MetricLabel.RELEASE_STAB_LIGHT, MetricPath.RELEASE_SLASH_LIGHT),
    new BasicMetric(MetricLabel.RELEASE_STAB_HEAVY, MetricPath.RELEASE_SLASH_LIGHT),
    new BasicMetric(MetricLabel.RELEASE_SPECIAL, MetricPath.RELEASE_SPECIAL),
    new BasicMetric(MetricLabel.RELEASE_SPRINT, MetricPath.RELEASE_SPRINT),
    new BasicMetric(MetricLabel.RELEASE_THROW, MetricPath.RELEASE_THROW),
    new BasicMetric(MetricLabel.COMBO_SLASH_LIGHT, MetricPath.COMBO_SLASH_LIGHT),
    new BasicMetric(MetricLabel.COMBO_SLASH_HEAVY, MetricPath.COMBO_SLASH_LIGHT),
    new BasicMetric(MetricLabel.COMBO_OVERHEAD_LIGHT, MetricPath.COMBO_SLASH_LIGHT),
    new BasicMetric(MetricLabel.COMBO_OVERHEAD_HEAVY, MetricPath.COMBO_SLASH_LIGHT),
    new BasicMetric(MetricLabel.COMBO_STAB_LIGHT, MetricPath.COMBO_SLASH_LIGHT),
    new BasicMetric(MetricLabel.COMBO_STAB_HEAVY, MetricPath.COMBO_SLASH_LIGHT),
    new BasicMetric(MetricLabel.COMBO_SPECIAL, MetricPath.COMBO_SPECIAL),
    new BasicMetric(MetricLabel.COMBO_SPRINT, MetricPath.COMBO_SPRINT),
    new BasicMetric(MetricLabel.COMBO_THROW, MetricPath.COMBO_THROW),

    // Average Windup
    new AggregateInverseMetric(
      MetricLabel.WINDUP_LIGHT_AVERAGE,
      [MetricPath.WINDUP_STAB_LIGHT, MetricPath.WINDUP_SLASH_LIGHT, MetricPath.WINDUP_OVERHEAD_LIGHT],
      average
    ),
    new AggregateInverseMetric(
      MetricLabel.WINDUP_HEAVY_AVERAGE,
      [MetricPath.WINDUP_STAB_HEAVY, MetricPath.WINDUP_SLASH_HEAVY, MetricPath.WINDUP_OVERHEAD_HEAVY],
      average
    ),

    // Average Recovery
    new AggregateInverseMetric(
      MetricLabel.RECOVERY_LIGHT_AVERAGE,
      [MetricPath.RECOVERY_STAB_LIGHT, MetricPath.RECOVERY_SLASH_LIGHT, MetricPath.RECOVERY_OVERHEAD_LIGHT],
      average
    ),
    new AggregateInverseMetric(
      MetricLabel.RECOVERY_HEAVY_AVERAGE,
      [MetricPath.RECOVERY_STAB_HEAVY, MetricPath.RECOVERY_SLASH_HEAVY, MetricPath.RECOVERY_OVERHEAD_HEAVY],
      average
    ),
    
    // Average Release
    new AggregateMetric(
      MetricLabel.RELEASE_LIGHT_AVERAGE,
      [MetricPath.RELEASE_STAB_LIGHT, MetricPath.RELEASE_SLASH_LIGHT, MetricPath.RELEASE_OVERHEAD_LIGHT],
      average
    ),
    new AggregateMetric(
      MetricLabel.RELEASE_HEAVY_AVERAGE,
      [MetricPath.RELEASE_STAB_HEAVY, MetricPath.RELEASE_SLASH_HEAVY, MetricPath.RELEASE_OVERHEAD_HEAVY],
      average
    ),

    // Average Combo
    new AggregateMetric(
      MetricLabel.COMBO_LIGHT_AVERAGE,
      [MetricPath.COMBO_STAB_LIGHT, MetricPath.COMBO_SLASH_LIGHT, MetricPath.COMBO_OVERHEAD_LIGHT],
      average
    ),
    new AggregateMetric(
      MetricLabel.COMBO_HEAVY_AVERAGE,
      [MetricPath.COMBO_STAB_HEAVY, MetricPath.COMBO_SLASH_HEAVY, MetricPath.COMBO_OVERHEAD_HEAVY],
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
    new AggregateMetric(
      MetricLabel.RANGE_AVERAGE, 
      [
        MetricPath.RANGE_OVERHEAD, MetricPath.RANGE_ALT_OVERHEAD, 
        MetricPath.RANGE_SLASH, MetricPath.RANGE_ALT_SLASH, 
        MetricPath.RANGE_STAB, MetricPath.RANGE_ALT_STAB, 
      ],
      average
    ),

    // Damages
    new BasicMetric(MetricLabel.DAMAGE_SLASH_LIGHT, MetricPath.DAMAGE_SLASH_LIGHT),
    new BasicMetric(MetricLabel.DAMAGE_SLASH_HEAVY, MetricPath.DAMAGE_SLASH_HEAVY),
    new BasicMetric(MetricLabel.DAMAGE_OVERHEAD_LIGHT, MetricPath.DAMAGE_OVERHEAD_LIGHT),
    new BasicMetric(MetricLabel.DAMAGE_OVERHEAD_HEAVY, MetricPath.DAMAGE_OVERHEAD_HEAVY),
    new BasicMetric(MetricLabel.DAMAGE_STAB_LIGHT, MetricPath.DAMAGE_STAB_LIGHT),
    new BasicMetric(MetricLabel.DAMAGE_STAB_HEAVY, MetricPath.DAMAGE_STAB_HEAVY),
    new BasicMetric(MetricLabel.DAMAGE_SPECIAL, MetricPath.DAMAGE_SPECIAL),
    new BasicMetric(MetricLabel.DAMAGE_SPRINT, MetricPath.DAMAGE_SPRINT),
    new BasicMetric(MetricLabel.DAMAGE_THROW, MetricPath.DAMAGE_THROW),

    new AggregateMetric(
      MetricLabel.DAMAGE_LIGHT_AVERAGE, 
      [MetricPath.DAMAGE_STAB_LIGHT, MetricPath.DAMAGE_OVERHEAD_LIGHT, MetricPath.DAMAGE_SLASH_LIGHT], 
      average
    ),
    new AggregateMetric(
      MetricLabel.DAMAGE_HEAVY_AVERAGE, 
      [MetricPath.DAMAGE_STAB_HEAVY, MetricPath.DAMAGE_OVERHEAD_HEAVY, MetricPath.DAMAGE_SLASH_HEAVY], 
      average
    )
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
export function unitGroupStats(weaponStats: WeaponStats): Map<string, { min: number; max: number; }> {
  const unitGroupStats = new Map<string, { min: number; max: number }>();

  // Across each weapon
  for (const [_, stats] of weaponStats) {
    // Across each category and unit type
    for (const [l, metric] of stats) {
      console.log(metric.value)
      if (metric.value.result === -1) continue;
      const existingCategory = unitGroupStats.get(l);
      const existingUnit  = unitGroupStats.get(metric.unit);

      if (existingCategory === undefined) {
        unitGroupStats.set(l, {
          min: metric.value.result,
          max: metric.value.result,
        });
      } else {
        unitGroupStats.set(l, {
          min: Math.min(existingCategory.min, metric.value.result),
          max: Math.max(existingCategory.max, metric.value.result),
        });
      }
      
      if (existingUnit === undefined) {
        unitGroupStats.set(metric.unit, {
          min: metric.value.result,
          max: metric.value.result,
        });
      } else {
        unitGroupStats.set(metric.unit, {
          min: Math.min(existingUnit.min, metric.value.result),
          max: Math.max(existingUnit.max, metric.value.result),
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
