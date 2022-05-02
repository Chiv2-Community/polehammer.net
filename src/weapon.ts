import { DerivedRatings, Metric, Rating, RawMetrics } from "./rating";
import DANE_AXE from "./weapons/dane_axe";
import KNIFE from "./weapons/knife";
import LONGSWOARD from "./weapons/longsword";
import MAUL from "./weapons/maul";
import POLEHAMMER from "./weapons/polehammer";
import RAPIER from "./weapons/rapier";

export enum Weapon {
  DANE_AXE = "Dane Axe",
  KNIFE = "Knife",
  LONGSWORD = "Longsword",
  MAUL = "Maul",
  POLEHAMMER = "Polehammer",
  RAPIER = "Rapier",
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
      // SPEED
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

      // RANGE
      case Rating.RANGE_HORIZONTAL:
        derived.set(k, metrics.get(Metric.RANGE_HORIZONTAL)!);
        break;
      case Rating.RANGE_ALT_HORIZONTAL:
        derived.set(k, metrics.get(Metric.RANGE_ALT_HORIZONTAL)!);
        break;
      case Rating.RANGE_OVERHEAD:
        derived.set(k, metrics.get(Metric.RANGE_OVERHEAD)!);
        break;
      case Rating.RANGE_ALT_OVERHEAD:
        derived.set(k, metrics.get(Metric.RANGE_ALT_OVERHEAD)!);
        break;
      case Rating.RANGE_STAB:
        derived.set(k, metrics.get(Metric.RANGE_STAB)!);
        break;
      case Rating.RANGE_ALT_STAB:
        derived.set(k, metrics.get(Metric.RANGE_ALT_STAB)!);
        break;
      case Rating.RANGE_AVERAGE:
        derived.set(
          k,
          average(derived, [
            Rating.RANGE_HORIZONTAL,
            Rating.RANGE_ALT_HORIZONTAL,
            Rating.RANGE_OVERHEAD,
            Rating.RANGE_ALT_OVERHEAD,
            Rating.RANGE_STAB,
            Rating.RANGE_ALT_STAB,
          ])
        );
        break;

      // DAMAGE
      case Rating.DAMAGE_HORIZONTAL_LIGHT:
        derived.set(k, metrics.get(Metric.DAMAGE_HORIZONTAL_LIGHT)!);
        break;
      case Rating.DAMAGE_HORIZONTAL_HEAVY:
        derived.set(k, metrics.get(Metric.DAMAGE_HORIZONTAL_HEAVY)!);
        break;
      case Rating.DAMAGE_OVERHEAD_LIGHT:
        derived.set(k, metrics.get(Metric.DAMAGE_OVERHEAD_LIGHT)!);
        break;
      case Rating.DAMAGE_OVERHEAD_HEAVY:
        derived.set(k, metrics.get(Metric.DAMAGE_OVERHEAD_HEAVY)!);
        break;
      case Rating.DAMAGE_STAB_LIGHT:
        derived.set(k, metrics.get(Metric.DAMAGE_STAB_LIGHT)!);
        break;
      case Rating.DAMAGE_STAB_HEAVY:
        derived.set(k, metrics.get(Metric.DAMAGE_STAB_HEAVY)!);
        break;
      case Rating.DAMAGE_SPECIAL:
        derived.set(k, metrics.get(Metric.DAMAGE_SPECIAL)!);
        break;
      case Rating.DAMAGE_AVERAGE:
        derived.set(
          k,
          average(derived, [
            Rating.DAMAGE_HORIZONTAL_LIGHT,
            Rating.DAMAGE_HORIZONTAL_HEAVY,
            Rating.DAMAGE_OVERHEAD_LIGHT,
            Rating.DAMAGE_OVERHEAD_HEAVY,
            Rating.DAMAGE_STAB_LIGHT,
            Rating.DAMAGE_STAB_HEAVY,
            Rating.DAMAGE_SPECIAL,
          ])
        );
        break;
    }
  }
  return derived;
}

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

const ratings = new Map([
  [Weapon.DANE_AXE, toDerived(DANE_AXE)],
  [Weapon.KNIFE, toDerived(KNIFE)],
  [Weapon.LONGSWORD, toDerived(LONGSWOARD)],
  [Weapon.MAUL, toDerived(MAUL)],
  [Weapon.POLEHAMMER, toDerived(POLEHAMMER)],
  [Weapon.RAPIER, toDerived(RAPIER)],
]);

export const NORMALIZED_RATINGS = normalize(ratings);
// export const NORMALIZED_RATINGS = ratings;
