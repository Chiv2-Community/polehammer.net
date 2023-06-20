import { ChartData } from "chart.js";
import { MetricLabel, MetricResult } from "./metrics";
import {
  UnitStats,
  WeaponStats
} from "./stats";
import { borderDash, weaponColor } from "./ui";
import { Weapon } from "./weapon";

// Normalization will only occur for stat types that have a unit present in the provided normalizationStats.
// This allows for selective normalization, like for bar charts where we want mostly raw data, except for
// "speed" (or other inverse metrics) which only make sense as a normalized value
export function generateNormalizedChartData(
  dataset: WeaponStats,
  weapons: Set<Weapon>,
  categories: Set<MetricLabel>,
  normalizationStats: UnitStats,
  setBgColor: boolean
): ChartData {

  let sortedCategories = [...categories];
  sortedCategories.sort((a, b) => {
    return Object.values(MetricLabel).indexOf(a) - Object.values(MetricLabel).indexOf(b);
  });

  return {
    labels: [...sortedCategories],
    datasets: [...weapons].map(w => {
      return {
        label: w.name,
        data: [...sortedCategories].map(c => {
          const metric = dataset.get(w.name)!.get(c)!;
          let value = metric.value.result;
          const maybeUnitStats = normalizationStats.get(c);
          if (maybeUnitStats) {
            const unitMin = maybeUnitStats!.min;
            const unitMax = maybeUnitStats!.max;

            // Normalize
            return (value - unitMin) / (unitMax - unitMin);
          }
          return value;
        }),
        backgroundColor: setBgColor ? weaponColor(w, 0.6) : weaponColor(w, 0.1),
        borderColor: weaponColor(w, 0.6),
        borderDash: borderDash(w),
      };
    }),
  };
}

export function weaponsToRows(weapons: Set<Weapon>, categories: Set<MetricLabel>, stats: WeaponStats): Array<Array<string | MetricResult>> {
  return [...weapons].map(w => {
    return [
      w.name,
      ...[...categories].map(c => {
        const metric = stats.get(w.name)!.get(c)!;
        return metric.value;
      }),
    ];
  });
}