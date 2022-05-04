import { Weapon, DamageType } from "./weapon"
import { MetricLabel, MetricPath, LabelledMetrics, InverseMetric, BasicMetric, AggregateMetric, AggregateInverseMetric, DAMAGE_METRICS, RANGE_METRICS, WINDUP_METRICS } from "./metrics"

const ALL_WEAPONS: Weapon[] = []

const DAMAGE_TYPES = new Map<string, DamageType>(
  ...ALL_WEAPONS.map(wep => [wep.name, wep.weaponType])
);

function average(lst: number[]) {
  if(lst.length > 0)
    return lst.reduce((a,b) => a+b)/lst.length;
  else
    return 0;
}

export function generate_metrics(weapons: Weapon[]): Map<string,LabelledMetrics> {
  // Need to invert the windups range (because higher is bad), so we need to figure out the range before hand.
  const windups: number[] = weapons.flatMap(wep => DAMAGE_METRICS.map(metric => wep.extractNumber(metric)));
  const maxWindup = Math.max(...windups);
  const minWindup = Math.min(...windups);

  const metricGenerators = [
    // Windups
    // Note that we invert each value within its range, because lower is better.
    new InverseMetric(MetricLabel.WINDUP_HORIZONTAL, MetricPath.WINDUP_HORIZONTAL, minWindup, maxWindup),
    new InverseMetric(MetricLabel.WINDUP_OVERHEAD, MetricPath.WINDUP_OVERHEAD, minWindup, maxWindup),
    new InverseMetric(MetricLabel.WINDUP_STAB, MetricPath.WINDUP_STAB, minWindup, maxWindup),
    new InverseMetric(MetricLabel.WINDUP_SPECIAL, MetricPath.WINDUP_SPECIAL, minWindup, maxWindup),
    new AggregateInverseMetric(MetricLabel.WINDUP_AVERAGE, WINDUP_METRICS, minWindup, maxWindup, average),

    // Ranges
    new BasicMetric(MetricLabel.RANGE_HORIZONTAL, MetricPath.RANGE_HORIZONTAL),
    new BasicMetric(MetricLabel.RANGE_ALT_HORIZONTAL, MetricPath.RANGE_HORIZONTAL),
    new BasicMetric(MetricLabel.RANGE_OVERHEAD, MetricPath.RANGE_OVERHEAD),
    new BasicMetric(MetricLabel.RANGE_ALT_OVERHEAD, MetricPath.RANGE_OVERHEAD),
    new BasicMetric(MetricLabel.RANGE_STAB, MetricPath.RANGE_STAB),
    new BasicMetric(MetricLabel.RANGE_ALT_STAB, MetricPath.RANGE_STAB),
    //new BasicMetric(MetricLabel.RANGE_SPECIAL, MetricPath.RANGE_SPECIAL), TODO
    new AggregateMetric(MetricLabel.RANGE_AVERAGE, RANGE_METRICS, average),

    // Damages
    new BasicMetric(MetricLabel.DAMAGE_HORIZONTAL_LIGHT, MetricPath.DAMAGE_HORIZONTAL_LIGHT),
    new BasicMetric(MetricLabel.DAMAGE_HORIZONTAL_HEAVY, MetricPath.DAMAGE_HORIZONTAL_HEAVY),
    new BasicMetric(MetricLabel.DAMAGE_OVERHEAD_LIGHT, MetricPath.DAMAGE_OVERHEAD_LIGHT),
    new BasicMetric(MetricLabel.DAMAGE_OVERHEAD_HEAVY, MetricPath.DAMAGE_OVERHEAD_HEAVY),
    new BasicMetric(MetricLabel.DAMAGE_STAB_LIGHT, MetricPath.DAMAGE_STAB_LIGHT),
    new BasicMetric(MetricLabel.DAMAGE_STAB_HEAVY, MetricPath.DAMAGE_STAB_HEAVY),
    new BasicMetric(MetricLabel.DAMAGE_SPECIAL, MetricPath.DAMAGE_SPECIAL),
    new AggregateMetric(MetricLabel.DAMAGE_AVERAGE, DAMAGE_METRICS, average)
  ];

  return new Map(weapons.map(w => [w.name, new Map(metricGenerators.map(m => [m.name, m.calculate(w)]))]));
}

export function hasBonus(category: MetricLabel) {
    return category.toLowerCase().contains("damage")
}

export type WeaponMetricLabels = Map<Weapon, DerivedMetricLabels>;

// Per-key, set values across all weapons to [0, 1]
function normalize(weapons: Weapon[]): Weapon[] {
  weapons.map((w) => {
    for Object.values(MetricLabel).map((k) => {
      const maxes = Object.values(MetricLabel).map((k) => [k, Math.max(...weapons.map(x => x.extractNumber(k)))]);
      const mins = Object.values(MetricLabel).map((k) => [k, Math.min(...weapons.map(x => x.extractNumber(k)))]);
      if (hasBonus(rating)) {
        div = maxPossibleBonus(weapon);
      }
    });
  });
  for (const weapon of weapons) {
    // Scale by min and max
    for (const [weapon, derived] of ratings) {
      let div = 1;
      if (hasBonus(rating)) {
        div = maxPossibleBonus(weapon);
      }
      derived.set(rating, (derived.get(rating)! - min) / (max - min) / div);
    }
  }
  return normalized;
}

const ratings = all
export const NORMALIZED_RATINGS = normalize(ratings);
export const RATINGS = ratings;
