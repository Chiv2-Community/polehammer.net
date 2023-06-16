// import ALL_WEAPONS, { weaponById } from "./all_weapons";
import {
  BasicMetric,
  InverseMetric,
  LabelledMetrics,
  MetricLabel,
  MetricPath,
//  Unit,
 // WeaponMetric,
} from "./metrics";
import { Target } from "./target";
import { withBonusMultipliers, Weapon, /*extractNumber */} from "./weapon";

export type WeaponStats = Map<string, LabelledMetrics>;

export type UnitStats = Map<string, { min: number; max: number }>;

export function generateMetrics(inputWeapons: Weapon[], numberOfTargets: number, horsebackDamageMult: number, target: Target): WeaponStats {
  const weapons = inputWeapons.map(w => withBonusMultipliers(w, numberOfTargets, horsebackDamageMult, target))
  const metricGenerators = [
 //   new WeaponMetric(MetricLabel.RANK, Unit.RANK, (w) => ALL_WEAPONS_RANKS.get(w.id)?.get("AVERAGE_RANK_RANK") as number),
    // For windup, recovery, and combo, lower is better
    new InverseMetric(MetricLabel.HOLDING_SLASH_LIGHT, MetricPath.HOLDING_SLASH_LIGHT),
    new InverseMetric(MetricLabel.HOLDING_SLASH_HEAVY, MetricPath.HOLDING_SLASH_HEAVY),
    new InverseMetric(MetricLabel.HOLDING_OVERHEAD_LIGHT, MetricPath.HOLDING_OVERHEAD_LIGHT),
    new InverseMetric(MetricLabel.HOLDING_OVERHEAD_HEAVY, MetricPath.HOLDING_OVERHEAD_HEAVY),
    new InverseMetric(MetricLabel.HOLDING_STAB_LIGHT, MetricPath.HOLDING_STAB_LIGHT),
    new InverseMetric(MetricLabel.HOLDING_STAB_HEAVY, MetricPath.HOLDING_STAB_HEAVY),
    new InverseMetric(MetricLabel.HOLDING_SPECIAL, MetricPath.HOLDING_SPECIAL),
    new InverseMetric(MetricLabel.HOLDING_LEAPING_STRIKE, MetricPath.HOLDING_LEAPING_STRIKE),
    new InverseMetric(MetricLabel.HOLDING_SPRINT_CHARGE, MetricPath.HOLDING_SPRINT_CHARGE),
    new InverseMetric(MetricLabel.HOLDING_THROW, MetricPath.HOLDING_THROW),

    new InverseMetric(MetricLabel.WINDUP_LIGHT_AVERAGE, MetricPath.WINDUP_AVERAGE_LIGHT),
    new InverseMetric(MetricLabel.WINDUP_HEAVY_AVERAGE, MetricPath.WINDUP_AVERAGE_HEAVY),
    new InverseMetric(MetricLabel.WINDUP_SLASH_LIGHT, MetricPath.WINDUP_SLASH_LIGHT),
    new InverseMetric(MetricLabel.WINDUP_SLASH_HEAVY, MetricPath.WINDUP_SLASH_HEAVY),
    new InverseMetric(MetricLabel.WINDUP_OVERHEAD_LIGHT, MetricPath.WINDUP_OVERHEAD_LIGHT),
    new InverseMetric(MetricLabel.WINDUP_OVERHEAD_HEAVY, MetricPath.WINDUP_OVERHEAD_HEAVY),
    new InverseMetric(MetricLabel.WINDUP_STAB_LIGHT, MetricPath.WINDUP_STAB_LIGHT),
    new InverseMetric(MetricLabel.WINDUP_STAB_HEAVY, MetricPath.WINDUP_STAB_HEAVY),
    new InverseMetric(MetricLabel.WINDUP_SPECIAL, MetricPath.WINDUP_SPECIAL),
    new InverseMetric(MetricLabel.WINDUP_LEAPING_STRIKE, MetricPath.WINDUP_LEAPING_STRIKE),
    new InverseMetric(MetricLabel.WINDUP_SPRINT_CHARGE, MetricPath.WINDUP_SPRINT_CHARGE),
    new InverseMetric(MetricLabel.WINDUP_THROW, MetricPath.WINDUP_THROW),

    new InverseMetric(MetricLabel.RECOVERY_LIGHT_AVERAGE, MetricPath.RECOVERY_AVERAGE_LIGHT),
    new InverseMetric(MetricLabel.RECOVERY_HEAVY_AVERAGE, MetricPath.RECOVERY_AVERAGE_HEAVY),
    new InverseMetric(MetricLabel.RECOVERY_SLASH_LIGHT, MetricPath.RECOVERY_SLASH_LIGHT),
    new InverseMetric(MetricLabel.RECOVERY_SLASH_HEAVY, MetricPath.RECOVERY_SLASH_HEAVY),
    new InverseMetric(MetricLabel.RECOVERY_OVERHEAD_LIGHT, MetricPath.RECOVERY_OVERHEAD_LIGHT),
    new InverseMetric(MetricLabel.RECOVERY_OVERHEAD_HEAVY, MetricPath.RECOVERY_OVERHEAD_HEAVY),
    new InverseMetric(MetricLabel.RECOVERY_STAB_LIGHT, MetricPath.RECOVERY_STAB_LIGHT),
    new InverseMetric(MetricLabel.RECOVERY_STAB_HEAVY, MetricPath.RECOVERY_STAB_HEAVY),
    new InverseMetric(MetricLabel.RECOVERY_SPECIAL, MetricPath.RECOVERY_SPECIAL),
    new InverseMetric(MetricLabel.RECOVERY_LEAPING_STRIKE, MetricPath.RECOVERY_LEAPING_STRIKE),
    new InverseMetric(MetricLabel.RECOVERY_SPRINT_CHARGE, MetricPath.RECOVERY_SPRINT_CHARGE),
    new InverseMetric(MetricLabel.RECOVERY_THROW, MetricPath.RECOVERY_THROW),
    new InverseMetric(MetricLabel.THWACK_LIGHT_AVERAGE, MetricPath.THWACK_AVERAGE_LIGHT),
    new InverseMetric(MetricLabel.THWACK_HEAVY_AVERAGE, MetricPath.THWACK_AVERAGE_HEAVY),
    new InverseMetric(MetricLabel.THWACK_SLASH_LIGHT, MetricPath.THWACK_SLASH_LIGHT),
    new InverseMetric(MetricLabel.THWACK_SLASH_HEAVY, MetricPath.THWACK_SLASH_HEAVY),
    new InverseMetric(MetricLabel.THWACK_OVERHEAD_LIGHT, MetricPath.THWACK_OVERHEAD_LIGHT),
    new InverseMetric(MetricLabel.THWACK_OVERHEAD_HEAVY, MetricPath.THWACK_OVERHEAD_HEAVY),
    new InverseMetric(MetricLabel.THWACK_STAB_LIGHT, MetricPath.THWACK_STAB_LIGHT),
    new InverseMetric(MetricLabel.THWACK_STAB_HEAVY, MetricPath.THWACK_STAB_HEAVY),
    new InverseMetric(MetricLabel.THWACK_SPECIAL, MetricPath.THWACK_SPECIAL),
    new InverseMetric(MetricLabel.THWACK_LEAPING_STRIKE, MetricPath.THWACK_LEAPING_STRIKE),
    new InverseMetric(MetricLabel.THWACK_SPRINT_CHARGE, MetricPath.THWACK_SPRINT_CHARGE),
    new InverseMetric(MetricLabel.THWACK_THROW, MetricPath.THWACK_THROW),

    new InverseMetric(MetricLabel.COMBO_LIGHT_AVERAGE, MetricPath.COMBO_AVERAGE_LIGHT),
    new InverseMetric(MetricLabel.COMBO_HEAVY_AVERAGE, MetricPath.COMBO_AVERAGE_HEAVY),
    new InverseMetric(MetricLabel.COMBO_SLASH_LIGHT, MetricPath.COMBO_SLASH_LIGHT),
    new InverseMetric(MetricLabel.COMBO_SLASH_HEAVY, MetricPath.COMBO_SLASH_HEAVY),
    new InverseMetric(MetricLabel.COMBO_OVERHEAD_LIGHT, MetricPath.COMBO_OVERHEAD_LIGHT),
    new InverseMetric(MetricLabel.COMBO_OVERHEAD_HEAVY, MetricPath.COMBO_OVERHEAD_HEAVY),
    new InverseMetric(MetricLabel.COMBO_STAB_LIGHT, MetricPath.COMBO_STAB_LIGHT),
    new InverseMetric(MetricLabel.COMBO_STAB_HEAVY, MetricPath.COMBO_STAB_HEAVY),
    new InverseMetric(MetricLabel.COMBO_SPECIAL, MetricPath.COMBO_SPECIAL),
    new InverseMetric(MetricLabel.COMBO_LEAPING_STRIKE, MetricPath.COMBO_LEAPING_STRIKE),
    new InverseMetric(MetricLabel.COMBO_SPRINT_CHARGE, MetricPath.COMBO_SPRINT_CHARGE),
    new InverseMetric(MetricLabel.COMBO_THROW, MetricPath.COMBO_THROW),

    new BasicMetric(MetricLabel.RELEASE_LIGHT_AVERAGE, MetricPath.RELEASE_AVERAGE_LIGHT),
    new BasicMetric(MetricLabel.RELEASE_HEAVY_AVERAGE, MetricPath.RELEASE_AVERAGE_HEAVY),
    new BasicMetric(MetricLabel.RELEASE_SLASH_LIGHT, MetricPath.RELEASE_SLASH_LIGHT),
    new BasicMetric(MetricLabel.RELEASE_SLASH_HEAVY, MetricPath.RELEASE_SLASH_HEAVY),
    new BasicMetric(MetricLabel.RELEASE_OVERHEAD_LIGHT, MetricPath.RELEASE_OVERHEAD_LIGHT),
    new BasicMetric(MetricLabel.RELEASE_OVERHEAD_HEAVY, MetricPath.RELEASE_OVERHEAD_HEAVY),
    new BasicMetric(MetricLabel.RELEASE_STAB_LIGHT, MetricPath.RELEASE_STAB_LIGHT),
    new BasicMetric(MetricLabel.RELEASE_STAB_HEAVY, MetricPath.RELEASE_STAB_HEAVY),
    new BasicMetric(MetricLabel.RELEASE_SPECIAL, MetricPath.RELEASE_SPECIAL),
    new BasicMetric(MetricLabel.RELEASE_LEAPING_STRIKE, MetricPath.RELEASE_LEAPING_STRIKE),
    new BasicMetric(MetricLabel.RELEASE_SPRINT_CHARGE, MetricPath.RELEASE_SPRINT_CHARGE),
    new BasicMetric(MetricLabel.RELEASE_THROW, MetricPath.RELEASE_THROW),

    new BasicMetric(MetricLabel.DAMAGE_LIGHT_AVERAGE, MetricPath.DAMAGE_AVERAGE_LIGHT),
    new BasicMetric(MetricLabel.DAMAGE_HEAVY_AVERAGE, MetricPath.DAMAGE_AVERAGE_HEAVY),
    new BasicMetric(MetricLabel.DAMAGE_SLASH_LIGHT, MetricPath.DAMAGE_SLASH_LIGHT),
    new BasicMetric(MetricLabel.DAMAGE_SLASH_HEAVY, MetricPath.DAMAGE_SLASH_HEAVY),
    new BasicMetric(MetricLabel.DAMAGE_OVERHEAD_LIGHT, MetricPath.DAMAGE_OVERHEAD_LIGHT),
    new BasicMetric(MetricLabel.DAMAGE_OVERHEAD_HEAVY, MetricPath.DAMAGE_OVERHEAD_HEAVY),
    new BasicMetric(MetricLabel.DAMAGE_STAB_LIGHT, MetricPath.DAMAGE_STAB_LIGHT),
    new BasicMetric(MetricLabel.DAMAGE_STAB_HEAVY, MetricPath.DAMAGE_STAB_HEAVY),
    new BasicMetric(MetricLabel.DAMAGE_SPECIAL, MetricPath.DAMAGE_SPECIAL),
    new BasicMetric(MetricLabel.DAMAGE_LEAPING_STRIKE, MetricPath.DAMAGE_LEAPING_STRIKE),
    new BasicMetric(MetricLabel.DAMAGE_SPRINT_CHARGE, MetricPath.DAMAGE_SPRINT_CHARGE),
    new BasicMetric(MetricLabel.DAMAGE_THROW, MetricPath.DAMAGE_THROW),

    new BasicMetric(MetricLabel.RANGE_SLASH, MetricPath.RANGE_SLASH),
    new BasicMetric(MetricLabel.RANGE_ALT_SLASH, MetricPath.RANGE_ALT_SLASH),
    new BasicMetric(MetricLabel.RANGE_OVERHEAD, MetricPath.RANGE_OVERHEAD),
    new BasicMetric(MetricLabel.RANGE_ALT_OVERHEAD, MetricPath.RANGE_ALT_OVERHEAD),
    new BasicMetric(MetricLabel.RANGE_STAB, MetricPath.RANGE_STAB),
    new BasicMetric(MetricLabel.RANGE_ALT_STAB, MetricPath.RANGE_ALT_STAB),
    new BasicMetric(MetricLabel.RANGE_AVERAGE, MetricPath.RANGE_AVERAGE),
    new BasicMetric(MetricLabel.RANGE_ALT_AVERAGE, MetricPath.RANGE_ALT_AVERAGE),
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
