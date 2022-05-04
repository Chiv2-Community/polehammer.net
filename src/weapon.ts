import { DerivedRatings, Metric, Rating, RawMetrics } from "./rating";
import { Target } from "./target";
import AXE from "./weapons/axe";
import BATTLE_AXE from "./weapons/battle_axe";
import CUDGEL from "./weapons/cudgel";
import DAGGER from "./weapons/dagger";
import DANE_AXE from "./weapons/dane_axe";
import EXECUTIONERS_AXE from "./weapons/executioners_axe";
import FALCHION from "./weapons/falchion";
import GLAIVE from "./weapons/glaive";
import GREATSWORD from "./weapons/greatsword";
import HALBERD from "./weapons/halberd";
import HATCHET from "./weapons/hatchet";
import HEAVY_MACE from "./weapons/heavy_mace";
import HIGHLAND_SWORD from "./weapons/highland_sword";
import JAVELIN from "./weapons/javelin";
import KNIFE from "./weapons/knife";
import LONGSWOARD from "./weapons/longsword";
import MACE from "./weapons/mace";
import MALLET from "./weapons/mallet";
import MAUL from "./weapons/maul";
import MESSER from "./weapons/messer";
import MORNING_STAR from "./weapons/morning_star";
import ONE_HANDED_SPEAR from "./weapons/one_handed_spear";
import PICKAXE from "./weapons/pickaxe";
import POLEAXE from "./weapons/poleaxe";
import POLEHAMMER from "./weapons/polehammer";
import RAPIER from "./weapons/rapier";
import SHORT_SWORD from "./weapons/short_sword";
import SHOVEL from "./weapons/shovel";
import SLEDGEHAMMER from "./weapons/sledgehammer";
import SWORD from "./weapons/sword";
import THROWING_AXE from "./weapons/throwing_axe";
import TWO_HANDED_HAMMER from "./weapons/two_handed_hammer";
import TWO_HANDED_SPEAR from "./weapons/two_handed_spear";
import WAR_AXE from "./weapons/war_axe";
import WAR_CLUB from "./weapons/war_club";
import WARHAMMER from "./weapons/warhammer";

import { hasBonus } from "./main";

enum DamageType {
  CUT = "Cut",
  CHOP = "Chop",
  BLUNT = "Blunt",
}

export enum Weapon {
  AXE = "Axe",
  BATTLE_AXE = "Battle Axe",
  CUDGEL = "Cudgel",
  DAGGER = "Dagger",
  DANE_AXE = "Dane Axe",
  EXECUTIONERS_AXE = "Executioner's Axe",
  FALCHION = "Falchion",
  GLAIVE = "Glaive",
  GREATSWORD = "Greatsword",
  HALBERD = "Halberd",
  HATCHET = "Hatchet",
  HEAVY_MACE = "Heavy Mace",
  HIGHLAND_SWORD = "Highland Sword",
  JAVELIN = "Javelin",
  KNIFE = "Knife",
  LONGSWORD = "Longsword",
  MACE = "Mace",
  MALLET = "Mallet",
  MAUL = "Maul",
  MESSER = "Messer",
  MORNING_STAR = "Morning Star",
  ONE_HANDED_SPEAR = "One-Handed Spear",
  PICKAXE = "Pickaxe",
  POLEAXE = "Poleaxe",
  POLEHAMMER = "Polehammer",
  RAPIER = "Rapier",
  SHORT_SWORD = "Short Sword",
  SHOVEL = "Shovel",
  SLEDGEHAMMER = "Sledgehammer",
  SWORD = "Sword",
  THROWING_AXE = "Throwing Axe",
  TWO_HANDED_HAMMER = "Two-Handed Hammer",
  TWO_HANDED_SPEAR = "Two-Handed Spear",
  WAR_AXE = "War Axe",
  WAR_CLUB = "War Club",
  WARHAMMER = "Warhammer",
}

const DAMAGE_TYPES = new Map<Weapon, DamageType>([
  [Weapon.AXE, DamageType.CHOP],
  [Weapon.BATTLE_AXE, DamageType.CHOP],
  [Weapon.CUDGEL, DamageType.BLUNT],
  [Weapon.DAGGER, DamageType.CUT],
  [Weapon.DANE_AXE, DamageType.CHOP],
  [Weapon.EXECUTIONERS_AXE, DamageType.CHOP],
  [Weapon.FALCHION, DamageType.CUT],
  [Weapon.GLAIVE, DamageType.CHOP],
  [Weapon.GREATSWORD, DamageType.CUT],
  [Weapon.HALBERD, DamageType.CHOP],
  [Weapon.HATCHET, DamageType.CHOP],
  [Weapon.HEAVY_MACE, DamageType.BLUNT],
  [Weapon.HIGHLAND_SWORD, DamageType.CUT],
  [Weapon.JAVELIN, DamageType.CUT],
  [Weapon.KNIFE, DamageType.CUT],
  [Weapon.LONGSWORD, DamageType.CUT],
  [Weapon.MACE, DamageType.BLUNT],
  [Weapon.MALLET, DamageType.BLUNT],
  [Weapon.MAUL, DamageType.BLUNT],
  [Weapon.MESSER, DamageType.CUT],
  [Weapon.MORNING_STAR, DamageType.BLUNT],
  [Weapon.ONE_HANDED_SPEAR, DamageType.CUT],
  [Weapon.PICKAXE, DamageType.CHOP],
  [Weapon.POLEAXE, DamageType.CHOP],
  [Weapon.POLEHAMMER, DamageType.BLUNT],
  [Weapon.RAPIER, DamageType.CUT],
  [Weapon.SHORT_SWORD, DamageType.CUT],
  [Weapon.SHOVEL, DamageType.BLUNT],
  [Weapon.SLEDGEHAMMER, DamageType.BLUNT],
  [Weapon.SWORD, DamageType.CUT],
  [Weapon.THROWING_AXE, DamageType.CHOP],
  [Weapon.TWO_HANDED_HAMMER, DamageType.BLUNT],
  [Weapon.TWO_HANDED_SPEAR, DamageType.CUT],
  [Weapon.WAR_AXE, DamageType.CHOP],
  [Weapon.WAR_CLUB, DamageType.BLUNT],
  [Weapon.WARHAMMER, DamageType.BLUNT],
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
  [Weapon.AXE, toDerived(AXE)],
  [Weapon.BATTLE_AXE, toDerived(BATTLE_AXE)],
  [Weapon.CUDGEL, toDerived(CUDGEL)],
  [Weapon.DAGGER, toDerived(DAGGER)],
  [Weapon.DANE_AXE, toDerived(DANE_AXE)],
  [Weapon.EXECUTIONERS_AXE, toDerived(EXECUTIONERS_AXE)],
  [Weapon.FALCHION, toDerived(FALCHION)],
  [Weapon.GLAIVE, toDerived(GLAIVE)],
  [Weapon.GREATSWORD, toDerived(GREATSWORD)],
  [Weapon.HALBERD, toDerived(HALBERD)],
  [Weapon.HATCHET, toDerived(HATCHET)],
  [Weapon.HEAVY_MACE, toDerived(HEAVY_MACE)],
  [Weapon.HIGHLAND_SWORD, toDerived(HIGHLAND_SWORD)],
  [Weapon.JAVELIN, toDerived(JAVELIN)],
  [Weapon.KNIFE, toDerived(KNIFE)],
  [Weapon.LONGSWORD, toDerived(LONGSWOARD)],
  [Weapon.MACE, toDerived(MACE)],
  [Weapon.MALLET, toDerived(MALLET)],
  [Weapon.MAUL, toDerived(MAUL)],
  [Weapon.MESSER, toDerived(MESSER)],
  [Weapon.MORNING_STAR, toDerived(MORNING_STAR)],
  [Weapon.ONE_HANDED_SPEAR, toDerived(ONE_HANDED_SPEAR)],
  [Weapon.PICKAXE, toDerived(PICKAXE)],
  [Weapon.POLEAXE, toDerived(POLEAXE)],
  [Weapon.POLEHAMMER, toDerived(POLEHAMMER)],
  [Weapon.RAPIER, toDerived(RAPIER)],
  [Weapon.SHORT_SWORD, toDerived(SHORT_SWORD)],
  [Weapon.SHOVEL, toDerived(SHOVEL)],
  [Weapon.SLEDGEHAMMER, toDerived(SLEDGEHAMMER)],
  [Weapon.SWORD, toDerived(SWORD)],
  [Weapon.THROWING_AXE, toDerived(THROWING_AXE)],
  [Weapon.TWO_HANDED_HAMMER, toDerived(TWO_HANDED_HAMMER)],
  [Weapon.TWO_HANDED_SPEAR, toDerived(TWO_HANDED_SPEAR)],
  [Weapon.WAR_AXE, toDerived(WAR_AXE)],
  [Weapon.WAR_CLUB, toDerived(WAR_CLUB)],
  [Weapon.WARHAMMER, toDerived(WARHAMMER)],
]);

export const NORMALIZED_RATINGS = normalize(ratings);
export const RATINGS = ratings;
