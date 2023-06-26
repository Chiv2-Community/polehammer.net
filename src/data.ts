import { ChartData } from "chart.js";
import { borderDash, weaponColor } from "./ui";
import { NewMetric, Range } from "./metrics";
import { Target, Weapon } from "chivalry2-weapons";

export type WeaponMetrics = Map<string, Map<string, WeaponMetric>>;
export type WeaponMetric = { result: number, metric: NewMetric };
export type MetricRanges = Map<string, Range>;

// Normalization will only occur for stat types that have a unit present in the provided normalizationStats.
// This allows for selective normalization, like for bar charts where we want mostly raw data, except for
// "speed" (or other inverse metrics) which only make sense as a normalized value
export function generateNormalizedChartData(
  ranges: MetricRanges,
  metrics: WeaponMetrics,
  setBgColor: boolean,
): ChartData {
  if(metrics.size == 0) {
    return {labels: [], datasets: []};
  }

  let labels = [...metrics.values().next().value.keys()];

  return {
    labels: labels,
    datasets: [...metrics.keys()].map(w => {
      return {
        label: w,
        data: [...metrics.get(w)!.keys()].map(m => {
          const value = metrics.get(w)!.get(m)!;
          const maybeRange = ranges.get(m);
          
          // normalize values if range is present
          if (maybeRange) {
            let normalizedResult = (value.result - maybeRange.min) / (maybeRange.max - maybeRange.min);
            if (!value.metric.higherIsBetter)
              return 1 - normalizedResult;
            else
              return normalizedResult;
          }

          return value.result;
        }),
        backgroundColor: setBgColor ? weaponColor(w, 0.6) : weaponColor(w, 0.1),
        borderColor: weaponColor(w, 0.6),
        borderDash: borderDash(w),
      };
    }),
  };
}

export function weaponsToRows(weaponMetrics: WeaponMetrics): Array<Array<string | WeaponMetric>> {
  let results: Array<Array<string | WeaponMetric>> = [];
  weaponMetrics.forEach((metricsMap, weaponName) => {
    let metrics = [...metricsMap.values()];
    results.push([weaponName, ...metrics]);
  });

  return results;
}


export function generateMetrics(metrics: NewMetric[], inputWeapons: Weapon[], numberOfTargets: number, horsebackDamageMult: number, target: Target): WeaponMetrics {
  return new Map(
    inputWeapons.map((w) => [
      w.name,
      new Map(
        metrics.map((m) => [
          m.label,
          {
            result: m.generate(w, target, numberOfTargets, horsebackDamageMult),
            metric: m,
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