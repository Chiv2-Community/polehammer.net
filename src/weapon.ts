import { DerivedRatings, Metric, Rating, RawMetrics } from "./rating";
import LONGSWOARD from "./weapons/longsword";
import RAPIER from "./weapons/rapier";

export enum Weapon {
  RAPIER = "Rapier",
  LONGSWORD = "Longsword",
}

function toDerived(metrics: RawMetrics): DerivedRatings {
  const derived = new Map<Rating, number>();
  for (const [k, v] of metrics) {
    switch (k) {
      case Metric.DURATION_HORIZONTAL:
        derived.set(Rating.SPEED_HORIZONTAL, 1 / v);
        break;
      case Metric.DURATION_OVERHEAD:
        derived.set(Rating.SPEED_OVERHEAD, 1 / v);
        break;
      case Metric.DURATION_SPECIAL:
        derived.set(Rating.SPEED_SPECIAL, 1 / v);
        break;
      case Metric.DURATION_STAB:
        derived.set(Rating.SPEED_STAB, 1 / v);
        break;
    }
  }
  return derived;
}

const ratings = new Map([
  [Weapon.RAPIER, toDerived(RAPIER)],
  [Weapon.LONGSWORD, toDerived(LONGSWOARD)],
]);

export type WeaponRatings = Map<Weapon, DerivedRatings>;

// Per-key, set values across all weapons to [0, 1]
function normalize(ratings: WeaponRatings): WeaponRatings {
  const normalized = new Map(ratings);
  for (const rating of Object.values(Rating)) {
    // Get min and max
    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;
    for (const [_weapon, derived] of ratings) {
      min = Math.min(min, derived.get(rating)!);
      max = Math.max(max, derived.get(rating)!);
    }

    // Scale by min and max
    for (const [_weapon, derived] of ratings) {
      derived.set(rating, (derived.get(rating)! - min) / (max - min));
    }
  }
  return normalized;
}

export const NORMALIZED_RATINGS = normalize(ratings);
