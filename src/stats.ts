import { NewMetric, Unit } from "./metrics";
import { Range } from "./types";
import { Target, Weapon } from "chivalry2-weapons";

export type WeaponMetrics = Map<string, Map<string, WeaponMetric>>;
export type WeaponMetric = { value: number, unit: Unit };
export type MetricRanges = Map<string, Range>;

export function generateMetrics(metrics: NewMetric[], inputWeapons: Weapon[], numberOfTargets: number, horsebackDamageMult: number, target: Target): WeaponMetrics {
  return new Map(
    inputWeapons.map((w) => [
      w.name,
      new Map(
        metrics.map((m) => [
          m.label,
          {
            value: m.generate(w, target, numberOfTargets, horsebackDamageMult),
            unit: m.unit,
          },
        ])
      ),
    ])
  );
}

// Across given weapon stats, calculate min and max (at max possible bonus)
// values for use in normalizing results for chart display
export function metricRanges(metrics: NewMetric[], weapons: Weapon[], target: Target, numberOfTargets: number, horsebackDamageMult: number): Map<string, { min: number; max: number; }> {
  const unitGroupStats = new Map<string, { min: number; max: number }>();
  metrics.forEach((m) => {
    const range = m.getMinMax(weapons, target, numberOfTargets, horsebackDamageMult);
    unitGroupStats.set(m.label, range);
  });

  return unitGroupStats;
}