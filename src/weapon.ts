import { Target } from "./target";

export function bonusMult(target: Target, type: DamageType): number {
  if (target === Target.VANGUARD_ARCHER) {
    return 1;
  }

  if (type === DamageType.CHOP) {
    return target === Target.FOOTMAN ? 1.175 : 1.25;
  } else if (type === DamageType.BLUNT) {
    return target === Target.FOOTMAN ? 1.35 : 1.5;
  } else {
    return 1;
  }
}

export function maxPossibleBonus(weapon: Weapon): number {
  return Math.max(
    ...Object.values(Target).map((target) =>
      bonusMult(target, weapon.damageType)
    )
  );
}

export function extractNumber(weapon: Weapon, path: string): number {
  let current: any = weapon; // eslint-disable-line
  const parts = path.split(".");
  for (const part of parts) {
    if (part in current) {
      current = current[part];
    } else {
      throw Error(`Invalid stat path specified: ${path}`);
    }
  }
  return current as unknown as number;
}

export type Weapon = {
  name: string;
  weaponTypes: WeaponType[];
  damageType: DamageType;
  attacks?: Record<SwingType, Swing>;
  specialAttack?: SpecialAttack;
  rangedAttack?: RangedAttack;
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
  BLUNT = "Blunt",
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
