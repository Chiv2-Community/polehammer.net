import { MetricResult } from "./metrics";
import { Weapon } from "./weapon";
import { categorySelector, stats } from "./main";

export function weaponsToRows(weapons: Set<Weapon>): Array<Array<string | MetricResult>> {
  return Array.from(weapons).map((w) => {
    return [
      w.name,
      ...Array.from(categorySelector.selectedItems).map((c) => {
        const metric = stats.get(w.name)!.get(c)!;
        return metric.value;
      }),
    ];
  });
}
