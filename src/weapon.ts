import { Target } from "./target";
import { MetricLabel } from "./metrics";

function canCleave(w: Weapon, path: string): boolean {
  let pathParts = path.split(".")
  pathParts.pop()
  let overridePath = pathParts.join(".") + ".cleaveOverride",
      cleaveOverride = extract<boolean>(w, overridePath)

  if (cleaveOverride != undefined) 
    return cleaveOverride

  if(path.startsWith("attacks")) {
    if(path.includes('heavy'))
      return true;
    
    return w.damageType != DamageType.BLUNT;
  }
  return false;
}

export function withBonusMultipliers(w: Weapon, numberOfTargets: number, horsebackDamageMult: number, target: Target): Weapon {
  return {
    ...w,
    "name": w.name,
    "weaponTypes": w.weaponTypes,
    "damageType": w.damageType,
    "attacks": {
      ...w.attacks,
      "slash": {
        ...w.attacks.slash,
        "range": w.attacks.slash.range,
        "altRange": w.attacks.slash.altRange,
        "light": {
          ...w.attacks.slash.light,
          "windup": w.attacks.slash.light.windup,
          "damage": w.attacks.slash.light.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "attacks.slash.light.damage")) * horsebackDamageMult
        },
        "heavy": {
          ...w.attacks.slash.heavy,
          "damage": w.attacks.slash.heavy.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "attacks.slash.heavy.damage")) * horsebackDamageMult
        }
      },
      "overhead": {
        ...w.attacks.overhead,
        "range": w.attacks.overhead.range,
        "altRange": w.attacks.overhead.altRange,
        "light": {
          ...w.attacks.overhead.light,
          "windup": w.attacks.overhead.light.windup,
          "damage": w.attacks.overhead.light.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "attacks.overhead.light.damage")) * horsebackDamageMult
        },
        "heavy": {
          ...w.attacks.overhead.heavy,
          "damage": w.attacks.overhead.heavy.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "attacks.overhead.heavy.damage")) * horsebackDamageMult
        }
      },
      "stab": {
        ...w.attacks.stab,
        "range": w.attacks.stab.range,
        "altRange": w.attacks.stab.altRange,
        "light": {
          ...w.attacks.stab.light,
          "windup": w.attacks.stab.light.windup,
          "damage": w.attacks.stab.light.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "attacks.stab.light.damage")) * horsebackDamageMult
        },
        "heavy": {
          ...w.attacks.stab.light,
          "damage": w.attacks.stab.heavy.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "attacks.stab.heavy.damage")) * horsebackDamageMult
        }
      }
    },
    "rangedAttack": {
      ...w.rangedAttack,
      "damage": {
        "torso": w.rangedAttack.damage.torso * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "rangedAttack.damage.torso")),
        "head": w.rangedAttack.damage.head * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "rangedAttack.damage.head")),
        "legs": w.rangedAttack.damage.legs * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "rangedAttack.damage.legs"))
      }
    },
    "specialAttack": {
      ...w.specialAttack,
      "windup": w.specialAttack.windup,
      "damage": w.specialAttack.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "specialAttack.damage")) * horsebackDamageMult
    },
    "leapAttack": {
      ...w.leapAttack,
      "windup": w.leapAttack.windup,
      "damage": w.leapAttack.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "leapAttack.damage"))
    },
    "chargeAttack": {
      ...w.chargeAttack,
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
  let result = extract<number>(weapon, path);

  if(result == undefined) {
    return 0;
  }

  return result
}

export function extract<T>(weapon: Weapon, path: string): T|undefined {
  let current: any = weapon; // eslint-disable-line
  const parts = path.split(".");
  for (const part of parts) {
    if (part in current) {
      current = current[part];
    } else {
      console.warn(`Invalid stat ${weapon.name} path specified: ${path}`);
      return undefined;
    }
  }
  return current 
}

export function damageType(weapon: Weapon, label: MetricLabel): DamageType {
  if(weapon.rangedAttack && label.toLowerCase().includes("thrown") && "damageTypeOverride" in weapon.rangedAttack)
    return weapon.rangedAttack.damageTypeOverride!;
  return weapon.damageType;
}

export type Weapon = {
  id: string;
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
  cleaveOverride?: boolean;
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
  cleaveOverride?: boolean;
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

  ARCHER = "Archer",
  LONGBOWMAN = "Longbowman",
  CROSSBOWMAN = "Crossbowman",
  SKIRMISHER = "Skirmisher",

  VANGUARD = "Vanguard",
  DEVASTATOR = "Devastator",
  RAIDER = "Raider",
  AMBUSHER = "Ambusher",
  FOOTMAN = "Footman",
  POLEMAN = "Poleman",
  MAN_AT_ARMS = "Man at Arms",
  ENGINEER = "Engineer",
  KNIGHT = "Knight",
  OFFICER = "Officer",
  GUARDIAN = "Guardian",
  CRUSADER = "Crusader"
}

export enum SwingType {
  SLASH = "slash",
  OVERHEAD = "overhead",
  STAB = "stab",
}
