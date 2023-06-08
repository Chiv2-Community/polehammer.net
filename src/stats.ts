// import ALL_WEAPONS, { weaponById } from "./all_weapons";
import {
  AggregateInverseMetric,
  AggregateMetric,
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

function average(lst: number[]) {
  if (lst.length > 0) return lst.reduce((a, b) => a + b) / lst.length;
  else return 0;
}
/*
const ALL_METRICS = Object.values(MetricPath)
function calculateMetricRank(weaponId: string, stat: string, invert: boolean = false, getNumber: (w: Weapon, stat: string) => number = extractNumber) {
  console.log(weaponId + " Invert: " + invert)
  console.log(weaponId + " Stat: " + stat)
  console.log(weaponId + " Stat Value: " + getNumber(weaponById(weaponId)!, stat))
  const all_weapons_sorted = [...ALL_WEAPONS].sort((a, b) => {
    if(invert)
      return getNumber(b, stat) - getNumber(a, stat);
    else
      return getNumber(a, stat) - getNumber(b, stat);
  });

  const rank = all_weapons_sorted.findIndex(w => w.id === weaponId);
  console.log(weaponId + " Rank: " + rank)
  return rank
}

function calculateAverageRank(ranks: Map<string, number>) {
  const all_ranks = [...ranks.values()];
  const average_rank = average(all_ranks);
  return average_rank;
}

function calculateAverageRankRank(weaponId: string) {
  const average_rank_rank = calculateMetricRank(weaponId, "AVERAGE_RANK", true, (w, stat) => ALL_WEAPONS_RANKS.get(w.id)?.get(stat) as number);
  return average_rank_rank;
}

const ALL_WEAPONS_RANKS = new Map<string, Map<string, number>>();
for(const weapon of ALL_WEAPONS) {
  const ranks = new Map<string, number>();
  for(const metric of ALL_METRICS) {
    const invert = MetricPath.toString().includes("windup") || MetricPath.toString().includes("recovery") || MetricPath.toString().includes("combo");
    ranks.set(metric, calculateMetricRank(weapon.id, metric, invert));
  }
  ranks.set("AVERAGE_RANK", calculateAverageRank(ranks));
  ALL_WEAPONS_RANKS.set(weapon.id, ranks);
}

for(const weapon of ALL_WEAPONS) {
  const ranks = ALL_WEAPONS_RANKS.get(weapon.id) as Map<string, number>;
  ranks.set("AVERAGE_RANK_RANK", calculateAverageRankRank(weapon.id));
}
*/





export function generateMetrics(inputWeapons: Weapon[], numberOfTargets: number, horsebackDamageMult: number, target: Target): WeaponStats {
  const weapons = inputWeapons.map(w => withBonusMultipliers(w, numberOfTargets, horsebackDamageMult, target))
  const metricGenerators = [
 //   new WeaponMetric(MetricLabel.RANK, Unit.RANK, (w) => ALL_WEAPONS_RANKS.get(w.id)?.get("AVERAGE_RANK_RANK") as number),
    // For windup, recovery, and combo, lower is better
    new InverseMetric(MetricLabel.WINDUP_SLASH_LIGHT, MetricPath.WINDUP_SLASH_LIGHT),
    new InverseMetric(MetricLabel.WINDUP_SLASH_HEAVY, MetricPath.WINDUP_SLASH_HEAVY),
    new InverseMetric(MetricLabel.WINDUP_OVERHEAD_LIGHT, MetricPath.WINDUP_OVERHEAD_LIGHT),
    new InverseMetric(MetricLabel.WINDUP_OVERHEAD_HEAVY, MetricPath.WINDUP_OVERHEAD_HEAVY),
    new InverseMetric(MetricLabel.WINDUP_STAB_LIGHT, MetricPath.WINDUP_STAB_LIGHT),
    new InverseMetric(MetricLabel.WINDUP_STAB_HEAVY, MetricPath.WINDUP_STAB_HEAVY),
    new InverseMetric(MetricLabel.WINDUP_SPECIAL, MetricPath.WINDUP_SPECIAL),
    new InverseMetric(MetricLabel.WINDUP_SPRINT, MetricPath.WINDUP_SPRINT),
    new InverseMetric(MetricLabel.WINDUP_THROW, MetricPath.WINDUP_THROW),
    new InverseMetric(MetricLabel.RECOVERY_SLASH_LIGHT, MetricPath.RECOVERY_SLASH_LIGHT),
    new InverseMetric(MetricLabel.RECOVERY_SLASH_HEAVY, MetricPath.RECOVERY_SLASH_HEAVY),
    new InverseMetric(MetricLabel.RECOVERY_OVERHEAD_LIGHT, MetricPath.RECOVERY_OVERHEAD_LIGHT),
    new InverseMetric(MetricLabel.RECOVERY_OVERHEAD_HEAVY, MetricPath.RECOVERY_OVERHEAD_HEAVY),
    new InverseMetric(MetricLabel.RECOVERY_STAB_LIGHT, MetricPath.RECOVERY_STAB_LIGHT),
    new InverseMetric(MetricLabel.RECOVERY_STAB_HEAVY, MetricPath.RECOVERY_STAB_HEAVY),
    new InverseMetric(MetricLabel.RECOVERY_SPECIAL, MetricPath.RECOVERY_SPECIAL),
    new InverseMetric(MetricLabel.RECOVERY_SPRINT, MetricPath.RECOVERY_SPRINT),
    new InverseMetric(MetricLabel.RECOVERY_THROW, MetricPath.RECOVERY_THROW),
    new InverseMetric(MetricLabel.COMBO_SLASH_LIGHT, MetricPath.COMBO_SLASH_LIGHT),
    new InverseMetric(MetricLabel.COMBO_SLASH_HEAVY, MetricPath.COMBO_SLASH_HEAVY),
    new InverseMetric(MetricLabel.COMBO_OVERHEAD_LIGHT, MetricPath.COMBO_OVERHEAD_LIGHT),
    new InverseMetric(MetricLabel.COMBO_OVERHEAD_HEAVY, MetricPath.COMBO_OVERHEAD_HEAVY),
    new InverseMetric(MetricLabel.COMBO_STAB_LIGHT, MetricPath.COMBO_STAB_LIGHT),
    new InverseMetric(MetricLabel.COMBO_STAB_HEAVY, MetricPath.COMBO_STAB_HEAVY),
    new InverseMetric(MetricLabel.COMBO_SPECIAL, MetricPath.COMBO_SPECIAL),
    new InverseMetric(MetricLabel.COMBO_SPRINT, MetricPath.COMBO_SPRINT),
    new InverseMetric(MetricLabel.COMBO_THROW, MetricPath.COMBO_THROW),

    // For combo and release, higher is better
    new BasicMetric(MetricLabel.RELEASE_SLASH_LIGHT, MetricPath.RELEASE_SLASH_LIGHT),
    new BasicMetric(MetricLabel.RELEASE_SLASH_HEAVY, MetricPath.RELEASE_SLASH_HEAVY),
    new BasicMetric(MetricLabel.RELEASE_OVERHEAD_LIGHT, MetricPath.RELEASE_OVERHEAD_LIGHT),
    new BasicMetric(MetricLabel.RELEASE_OVERHEAD_HEAVY, MetricPath.RELEASE_OVERHEAD_HEAVY),
    new BasicMetric(MetricLabel.RELEASE_STAB_LIGHT, MetricPath.RELEASE_STAB_LIGHT),
    new BasicMetric(MetricLabel.RELEASE_STAB_HEAVY, MetricPath.RELEASE_STAB_HEAVY),
    new BasicMetric(MetricLabel.RELEASE_SPECIAL, MetricPath.RELEASE_SPECIAL),
    new BasicMetric(MetricLabel.RELEASE_SPRINT, MetricPath.RELEASE_SPRINT),
    new BasicMetric(MetricLabel.RELEASE_THROW, MetricPath.RELEASE_THROW),

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
    new AggregateInverseMetric(
      MetricLabel.COMBO_LIGHT_AVERAGE,
      [MetricPath.COMBO_STAB_LIGHT, MetricPath.COMBO_SLASH_LIGHT, MetricPath.COMBO_OVERHEAD_LIGHT],
      average
    ),
    new AggregateInverseMetric(
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
