import { Weapon } from "./weapon"
import { MetricLabel, MetricPath, LabelledMetrics, InverseMetric, BasicMetric, AggregateMetric, AggregateInverseMetric, DAMAGE_METRICS, RANGE_METRICS, WINDUP_METRICS } from "./metrics"

export type WeaponStats = Map<Weapon, LabelledMetrics>;

function average(lst: number[]) {
  if(lst.length > 0)
    return lst.reduce((a,b) => a+b)/lst.length;
  else
    return 0;
}

export function generateMetrics(weapons: Weapon[]): WeaponStats {
  // Need to invert the windups range (because higher is bad), so we need to figure out the range before hand.
  const windups: number[] = weapons.flatMap(wep => WINDUP_METRICS.map(metric => wep.extractNumber(metric)));
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

  return new Map(weapons.map(w => [w, new Map(metricGenerators.map(m => [m.name, m.calculate(w)]))]));
}

export function hasBonus(category: MetricLabel) {
    return category.toLowerCase().includes("damage")
}

export type WeaponMetricLabels = Map<string, MetricLabel>;

export function normalize(stats: WeaponStats): WeaponStats {
  const normalized = new Map(stats);
  for (const rating of Object.values(MetricLabel)) {
    // Get min and max for this rating _across all weapons_
    // Scale max possible damage based on weapon's damage type
    let values: number[] = [...stats.values()].map((x:LabelledMetrics) => x.get(rating)!)
    let min = Math.min(...values);
    let max = Math.max(...values);

    // Scale by min and max
    for (const [weapon, derived] of normalized) {
      let div = 1.0;
      if (hasBonus(rating)) {
        div = weapon.maxPossibleBonus();
      }
      derived.set(rating, (derived.get(rating)! - min) / (max - min) / div);
    }
  }
  return normalized;
}
