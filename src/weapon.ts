import { DerivedRatings, Metric, Rating, RawMetrics } from "./rating";
import { Target } from "./target";
import DANE_AXE from "./weapons/dane_axe";
import KNIFE from "./weapons/knife";
import LONGSWOARD from "./weapons/longsword";
import MAUL from "./weapons/maul";
import POLEHAMMER from "./weapons/polehammer";
import RAPIER from "./weapons/rapier";
import GREATSWORD from "./weapons/greatsword";
import MESSER from "./weapons/messer";
import HIGHLAND_SWORD from "./weapons/highland_sword";
import FALCHION from "./weapons/falchion";
import SWORD from "./weapons/sword";
import { hasBonus } from "./main";

class Weapon {
  name: string;
  weapon_type: WeaponType;
  damage_type: DamageType;
  two_handed: boolean;
  attacks: Map[SwingType, Swing]
  special_attack: SpecialAttack
  ranged_attack: RangedAttack
}

class SpecialAttack {
  range: number
  windup: number
  damage: number
}

class Swing {
  range: number;
  alt_range: number?;

  // TODO: Create AttackDuration class containing windup/active hitbox/cooldown
  windup: number; // milliseconds
  light: MeleeAttack
  heavy: MeleeAttack
}

class RangedAttack {
  projectile_speed: number?; // probably not measured yet
  windup: number?; // milliseconds
  damage: ProjectileDamage
}

class MeleeAttack {
  windup: number;
  damage: number; 
}

class ProjectileDamage {
  head: number;
  torso: number;
  legs: number;
}

enum DamageType {
  CUT = "Cut",
  CHOP = "Chop",
  BLUNT = "Blunt",
}

export enum WeaponType {
  AXE = "Axe",
  HAMMER = "Hammer",
  SWORD = "Sword",
  BOW = "Bow"
}

export enum SwingTypes {
  HORIZONTAL = "horizontal",
  OVERHEAD = "overhead",
  STAB = "stab"
}



const DAMAGE_TYPES = new Map<Weapon, DamageType>([
  [Weapon.DANE_AXE, DamageType.CHOP],
  [Weapon.FALCHION, DamageType.CUT],
  [Weapon.GREATSWORD, DamageType.CUT],
  [Weapon.HIGHLAND_SWORD, DamageType.CUT],
  [Weapon.KNIFE, DamageType.CUT],
  [Weapon.LONGSWORD, DamageType.CUT],
  [Weapon.MAUL, DamageType.BLUNT],
  [Weapon.MESSER, DamageType.CUT],
  [Weapon.POLEHAMMER, DamageType.BLUNT],
  [Weapon.RAPIER, DamageType.CUT],
  [Weapon.SWORD, DamageType.CUT],
]);

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

export function bonusMult(weapon: Weapon, target: Target): number {
  if (target === Target.VANGUARD_ARCHER) {
    return 1;
  }

  const type = damageType(weapon);
  if (type === DamageType.CHOP) {
    return target === Target.FOOTMAN ? 1.175 : 1.25;
  } else if (type === DamageType.BLUNT) {
    return target === Target.FOOTMAN ? 1.35 : 1.5;
  } else {
    return 1;
  }
}

function damageType(weapon: Weapon): DamageType {
  return DAMAGE_TYPES.get(weapon)!;
}

function maxPossibleBonus(weapon: Weapon) {
  return Math.max(
    ...Object.values(Target).map((target) => bonusMult(weapon, target))
  );
}

// Per-key, set values across all weapons to [0, 1]
function normalize(ratings: WeaponRatings): WeaponRatings {
  const normalized = new Map(ratings);
  for (const rating of Object.values(Rating)) {
    // Get min and max for this rating _across all weapons_
    // Scale max possible damage based on weapon's damage type
    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;
    for (const [_weapon, derived] of ratings) {
      min = Math.min(min, derived.get(rating)!);
      max = Math.max(max, derived.get(rating)!);
    }

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

const ratings = new Map([
  [Weapon.DANE_AXE, toDerived(DANE_AXE)],
  [Weapon.FALCHION, toDerived(FALCHION)],
  [Weapon.GREATSWORD, toDerived(GREATSWORD)],
  [Weapon.HIGHLAND_SWORD, toDerived(HIGHLAND_SWORD)],
  [Weapon.KNIFE, toDerived(KNIFE)],
  [Weapon.LONGSWORD, toDerived(LONGSWOARD)],
  [Weapon.MAUL, toDerived(MAUL)],
  [Weapon.MESSER, toDerived(MESSER)],
  [Weapon.POLEHAMMER, toDerived(POLEHAMMER)],
  [Weapon.RAPIER, toDerived(RAPIER)],
  [Weapon.SWORD, toDerived(SWORD)],
]);

export const NORMALIZED_RATINGS = normalize(ratings);
export const RATINGS = ratings;
