import { ChartData } from "chart.js";
import {
  MetricRanges,
  WeaponMetrics,
} from "./stats";
import { borderDash, weaponColor } from "./ui";

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
          const value = metrics.get(w)!.get(m)!.value;
          const maybeRange = ranges.get(m);
          if (maybeRange) {
            const unitMin = maybeRange!.min;
            const unitMax = maybeRange!.max;

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

export function weaponsToRows(weaponMetrics: WeaponMetrics): Array<Array<string | number>> {
  let results: Array<Array<string | number>> = [];
  weaponMetrics.forEach((metricsMap, weaponName) => {
    let metrics = [...metricsMap.values()].map(m => m.value);
    results.push([weaponName, ...metrics]);
  });

  return results;
}