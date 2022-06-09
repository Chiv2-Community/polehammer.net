import { Target } from "./target";
import { MetricLabel } from "./metrics";

function canCleave(w: Weapon, path: string): boolean {
  if(path.startsWith("attacks")) {
    if(path.includes('heavy'))
      return true;
    
    return w.damageType != DamageType.BLUNT;
  }
  return false;
}

export function withBonusMultipliers(w: Weapon, numberOfTargets: number, target: Target): Weapon {
  return {
    "name": w.name,
    "weaponTypes": w.weaponTypes,
    "damageType": w.damageType,
    "attacks": {
      "horizontal": {
        "range": w.attacks.horizontal.range,
        "altRange": w.attacks.horizontal.altRange,
        "light": {
          "windup": w.attacks.horizontal.light.windup,
          "damage": w.attacks.horizontal.light.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "attacks.horizontal.light.damage"))
        },
        "heavy": {
          "damage": w.attacks.horizontal.heavy.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "attacks.horizontal.heavy.damage"))
        }
      },
      "overhead": {
        "range": w.attacks.overhead.range,
        "altRange": w.attacks.overhead.altRange,
        "light": {
          "windup": w.attacks.overhead.light.windup,
          "damage": w.attacks.overhead.light.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "attacks.overhead.light.damage"))
        },
        "heavy": {
          "damage": w.attacks.overhead.heavy.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "attacks.overhead.heavy.damage"))
        }
      },
      "stab": {
        "range": w.attacks.stab.range,
        "altRange": w.attacks.stab.altRange,
        "light": {
          "windup": w.attacks.stab.light.windup,
          "damage": w.attacks.stab.light.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "attacks.stab.light.damage"))
        },
        "heavy": {
          "damage": w.attacks.stab.heavy.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "attacks.stab.heavy.damage"))
        }
      }
    },
    "rangedAttack": {
      "damage": {
        "torso": w.rangedAttack.damage.torso * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "rangedAttack.damage.torso")),
        "head": w.rangedAttack.damage.head * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "rangedAttack.damage.head")),
        "legs": w.rangedAttack.damage.legs * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "rangedAttack.damage.legs"))
      }
    },
    "specialAttack": {
      "windup": w.specialAttack.windup,
      "damage": w.specialAttack.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "specialAttack.damage"))
    },
    "leapAttack": {
      "windup": w.leapAttack.windup,
      "damage": w.leapAttack.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "leapAttack.damage"))
    },
    "chargeAttack": {
      "windup": w.chargeAttack.windup,
      "damage": w.chargeAttack.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "chargeAttack.damage"))
    }
  } as Weapon
}

function bonusMult(numberOfTargets: number, target: Target, type: DamageType, cleaves: boolean): number {
  const cleavingMultiplier = cleaves ? numberOfTargets : 1

  // Multiply Vanguard / Archer by 2 assuming equal distribution of target classes
  if (target === Target.AVERAGE) {
    const sum =
      2 * bonusMult(numberOfTargets, Target.VANGUARD_ARCHER, type, cleaves) +
      bonusMult(numberOfTargets, Target.FOOTMAN, type, cleaves) +
      bonusMult(numberOfTargets, Target.KNIGHT, type, cleaves);

    return sum / 4;
  } else if (target === Target.VANGUARD_ARCHER) {
    return cleavingMultiplier;
  } else if (type === DamageType.CHOP) {
    return (target === Target.FOOTMAN ? 1.175 : 1.25) * cleavingMultiplier;
  } else if (type === DamageType.BLUNT) {
    return (target === Target.FOOTMAN ? 1.35 : 1.5) * cleavingMultiplier;
  }

  return cleavingMultiplier;
}

export function extractNumber(weapon: Weapon, path: string): number {
  let current: any = weapon; // eslint-disable-line
  const parts = path.split(".");
  for (const part of parts) {
    if (part in current) {
      current = current[part];
    } else {
      console.warn(`Invalid stat ${weapon.name} path specified: ${path}`);
      return 0;
    }
  }
  return current as unknown as number;
}

export function damageType(weapon: Weapon, label: MetricLabel): DamageType {
  if(weapon.rangedAttack && label.toLowerCase().includes("thrown") && "damageTypeOverride" in weapon.rangedAttack)
    return weapon.rangedAttack.damageTypeOverride!;
  return weapon.damageType;
}

export type Weapon = {
  name: string;
  weaponTypes: WeaponType[];
  damageType: DamageType;
  attacks: Record<SwingType, Swing>;
  specialAttack: SpecialAttack;
  leapAttack: SpecialAttack;
  chargeAttack: SpecialAttack;
  rangedAttack: RangedAttack;
};

export type SpecialAttack = {
  windup: number;
  damage: number;
  range?: number; // Not measured yet
};

export type Swing = {
  range: number;
  altRange: number;

  // TODO: Create AttackDuration class containing windup/active hitbox/cooldown
  light: MeleeAttack;
  heavy: MeleeAttack;
};

export type RangedAttack = {
  damageTypeOverride?: DamageType;
  projectileSpeed?: number; // Not measured yet
  windup?: number; // milliseconds
  damage: ProjectileDamage;
};

export type MeleeAttack = {
  damage: number;
  windup?: number; // We don't yet know these for heavy attacks
};

export type ProjectileDamage = {
  head: number;
  torso: number;
  legs: number;
};

export enum DamageType {
  CUT = "Cut",
  CHOP = "Chop",
  BLUNT = "Blunt"
}

export enum WeaponType {
  AXE = "Axe",
  HAMMER = "Hammer",
  CLUB = "Club",
  TOOL = "Tool",
  POLEARM = "Polearm",
  SPEAR = "Spear",
  SWORD = "Sword",
  Dagger = "Dagger",
  BOW = "Bow",
  TWO_HANDED = "Two Handed",
  ONE_HANDED = "One Handed",
}

export enum SwingType {
  HORIZONTAL = "horizontal",
  OVERHEAD = "overhead",
  STAB = "stab",
}
