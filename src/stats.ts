import {
  AggregateInverseMetric,
  AggregateMetric,
  BasicMetric,
  InverseMetric,
  LabelledMetrics,
  MetricLabel,
  MetricPath,
  Unit,
} from "./metrics";
import { Target } from "./target";
import { withBonusMultipliers, Weapon } from "./weapon";

export type WeaponStats = Map<string, LabelledMetrics>;

export type UnitStats = Map<string, { min: number; max: number }>;

function average(lst: number[]) {
  if (lst.length > 0) return lst.reduce((a, b) => a + b) / lst.length;
  else return 0;
}

export function generateMetrics(inputWeapons: Weapon[], numberOfTargets: number, horsebackDamageMult: number, target: Target): WeaponStats {
  const weapons = inputWeapons.map(w => withBonusMultipliers(w, numberOfTargets, horsebackDamageMult, target))
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
      [MetricPath.WINDUP_STAB, MetricPath.WINDUP_SLASH, MetricPath.WINDUP_OVERHEAD],
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
    new AggregateMetric(MetricLabel.POLEHAMMER_INDEX, [
      MetricPath.DAMAGE_SLASH_HEAVY, 
      MetricPath.DAMAGE_OVERHEAD_HEAVY,
      MetricPath.DAMAGE_STAB_HEAVY, 

      MetricPath.DAMAGE_SLASH_LIGHT, 
      MetricPath.DAMAGE_OVERHEAD_LIGHT,
      MetricPath.DAMAGE_STAB_LIGHT, 

      MetricPath.DAMAGE_SPECIAL,

      MetricPath.WINDUP_SLASH,
      MetricPath.WINDUP_OVERHEAD,
      MetricPath.WINDUP_STAB,
      MetricPath.WINDUP_SPECIAL,

      MetricPath.RANGE_SLASH,
      MetricPath.RANGE_ALT_SLASH,

      MetricPath.RANGE_OVERHEAD,
      MetricPath.RANGE_ALT_OVERHEAD,

      MetricPath.RANGE_STAB,
      MetricPath.RANGE_ALT_STAB,
      
      MetricPath.DAMAGE_RANGED_HEAD,
      MetricPath.DAMAGE_RANGED_TORSO,
      MetricPath.DAMAGE_RANGED_LEGS
    ], (inputs => {
      let horizontalHeavyDamage = inputs[0],
          overheadHeavyDamage = inputs[1],
          stabHeavyDamage = inputs[2],
          horizontalLightDamage = inputs[3],
          overheadLightDamage = inputs[4],
          stabLightDamage = inputs[5],
          specialDamage = inputs[6],
          horizontalWindup = inputs[7],
          overheadWindup = inputs[8],
          stabWindup = inputs[9],
          specialWindup = inputs[10],
          horizontalRange = inputs[11],
          horizontalAltRange = inputs[12],
          overheadRange = inputs[13],
          overheadAltRange = inputs[14],
          stabRange = inputs[13],
          stabAltRange = inputs[14],
          headRangedDamage = inputs[15],
          torsoRangedDamage = inputs[16],
          legsRangedDamage = inputs[17]

      let averageDamageScore =
        (horizontalHeavyDamage + horizontalLightDamage +
        overheadHeavyDamage + overheadLightDamage +
        stabHeavyDamage + stabLightDamage + specialDamage) / 7

      let averageHeavyBuffScore = 
        ((horizontalHeavyDamage + overheadHeavyDamage + stabHeavyDamage) -
        (horizontalLightDamage + overheadLightDamage + stabLightDamage)) / 3
      
      let averageWindupScore = (horizontalWindup + overheadWindup + stabWindup + specialWindup) / 4
      
      let averageRangeScore = 
        (horizontalRange + horizontalAltRange +
        overheadRange + overheadAltRange +
        stabRange + stabAltRange) / 6

      let averageThrownDamageScore =
        (headRangedDamage + torsoRangedDamage + legsRangedDamage) / 3
    
      return (averageDamageScore/2.5) + 
        (averageHeavyBuffScore) +
        (averageRangeScore/3) + 
        (averageThrownDamageScore/5) -
        (averageWindupScore/100);
    }), Unit.INDEX),
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
