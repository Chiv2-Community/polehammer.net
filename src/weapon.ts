import { DerivedRatings, Metric, Rating, RawMetrics } from "./rating";
import LONGSWOARD from "./weapons/longsword";
import RAPIER from "./weapons/rapier";

export enum Weapon {
  RAPIER = "Rapier",
  LONGSWORD = "Longsword",
}

function average(derived: DerivedRatings, ratings: Array<Rating>): number {
  return (
    ratings.map((r) => derived.get(r)!).reduce((p, c) => p + c, 0) /
    ratings.length
  );
}

function toDerived(metrics: RawMetrics): DerivedRatings {
  const derived: DerivedRatings = new Map();
  for (const k of Object.values(Rating)) {
    switch (k) {
      case Rating.SPEED_HORIZONTAL:
        derived.set(k, 1 / metrics.get(Metric.DURATION_HORIZONTAL)!);
        break;
      case Rating.SPEED_OVERHEAD:
        derived.set(k, 1 / metrics.get(Metric.DURATION_OVERHEAD)!);
        break;
      case Rating.SPEED_SPECIAL:
        derived.set(k, 1 / metrics.get(Metric.DURATION_SPECIAL)!);
        break;
      case Rating.SPEED_STAB:
        derived.set(k, 1 / metrics.get(Metric.DURATION_STAB)!);
        break;
      case Rating.SPEED_AVERAGE:
        derived.set(
          k,
          average(derived, [
            Rating.SPEED_HORIZONTAL,
            Rating.SPEED_OVERHEAD,
            Rating.SPEED_SPECIAL,
            Rating.SPEED_STAB,
          ])
        );
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
