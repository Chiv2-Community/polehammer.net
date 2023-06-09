import { Target } from "./target";
import { MetricLabel } from "./metrics";

export type Attacks = {
  average: Swing;
  slash: Swing;
  overhead: Swing;
  stab: Swing;
  sprintAttack: SpecialAttack;
  special: SpecialAttack;
  throw: SpecialAttack;
};

export type Weapon = {
  id: string;
  name: string;
  weaponTypes: WeaponType[];
  damageType: DamageType;
  attacks: Attacks;
};


export type SpecialAttack = {
  damage: number;
  windup: number; 
  release: number; 
  recovery: number; 
  combo: number;
  range?: number; // Not measured yet
  cleaveOverride?: boolean;
  damageTypeOverride?: DamageType;
};

export type Swing = {
  range: number;
  altRange: number;
  light: MeleeAttack;
  heavy: MeleeAttack;
};

export type MeleeAttack = {
  damage: number;
  windup: number; 
  release: number; 
  recovery: number; 
  combo: number;
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
};

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
};

export enum AttackType {
  SLASH = "slash",
  OVERHEAD = "overhead",
  STAB = "stab",
  THROW = "throw",
  SPRINT = "sprintAttack",
  SPECIAL = "special",
};

function canCleave(w: Weapon, path: string): boolean {
  let pathParts = path.split(".")
  pathParts.pop()
  let overridePath = pathParts.join(".") + ".cleaveOverride",
      cleaveOverride = extract<boolean>(w, overridePath, true)

  if (cleaveOverride != undefined) 
    return cleaveOverride

  if(path.startsWith("attacks")) {
    if(path.includes('heavy'))
      return true;
    
    return w.damageType != DamageType.BLUNT;
  }
  return false;
}


export function extract<T>(weapon: Weapon, path: string, optional: boolean = false): T|undefined {
  let current: any = weapon; // eslint-disable-line
  const parts = path.split(".");
  for (const part of parts) {
    if (part in current) {
      current = current[part];
    } else {
      if(!optional)
        console.warn(`Invalid stat ${weapon.name} path specified: ${path}`);
      return undefined;
    }
  }
  return current 
}

export function withBonusMultipliers(w: Weapon, numberOfTargets: number, horsebackDamageMult: number, target: Target): Weapon {
  return {
    ...w,
    "attacks": {
      ...w.attacks,
      "slash": {
        ...w.attacks.slash,
        "light": {
          ...w.attacks.slash.light,
          "damage": w.attacks.slash.light.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "attacks.slash.light.damage")) * horsebackDamageMult
        },
        "heavy": {
          ...w.attacks.slash.heavy,
          "damage": w.attacks.slash.heavy.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "attacks.slash.heavy.damage")) * horsebackDamageMult
        }
      },
      "overhead": {
        ...w.attacks.overhead,
        "light": {
          ...w.attacks.overhead.light,
          "damage": w.attacks.overhead.light.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "attacks.overhead.light.damage")) * horsebackDamageMult
        },
        "heavy": {
          ...w.attacks.overhead.heavy,
          "damage": w.attacks.overhead.heavy.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "attacks.overhead.heavy.damage")) * horsebackDamageMult
        }
      },
      "stab": {
        ...w.attacks.stab,
        "light": {
          ...w.attacks.stab.light,  
          "damage": w.attacks.stab.light.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "attacks.stab.light.damage")) * horsebackDamageMult
        },
        "heavy": {
          ...w.attacks.stab.heavy,  
          "damage": w.attacks.stab.heavy.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "attacks.stab.heavy.damage")) * horsebackDamageMult
        }
      },
      "throw": {
        ...w.attacks.throw,  
        "damage": w.attacks.throw.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "attacks.throw.damage"))
      },
      "special": {
        ...w.attacks.special,
        "damage": w.attacks.special.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "attacks.special.damage")) * horsebackDamageMult
      },
      "sprintAttack": {
        ...w.attacks.sprintAttack,
        "damage": w.attacks.sprintAttack.damage * bonusMult(numberOfTargets, target, w.damageType, canCleave(w, "attacks.sprintAttack.damage"))
      }
    }
  } as Weapon
}

export function bonusMult(numberOfTargets: number, target: Target, type: DamageType, cleaves: boolean): number {
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
};

export function damageType(weapon: Weapon, label: MetricLabel): DamageType {
  if(label.toLowerCase().includes("throw") && "damageTypeOverride" in weapon.attacks.throw)
    return weapon.attacks.throw.damageTypeOverride!;
  return weapon.damageType;
};
