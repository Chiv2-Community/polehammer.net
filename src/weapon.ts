import { Target } from "./target";

export class Weapon {
  name!: string;
  weaponType!: WeaponType;
  damageType!: DamageType;
  twoHanded!: boolean;
  attacks?: Map<SwingType, Swing>;
  specialAttack?: SpecialAttack;
  rangedAttack?: RangedAttack;

  constructor( name: string, weaponType: WeaponType, damageType: DamageType, twoHanded: boolean, attacks: Map<SwingType, Swing>, specialAttack: SpecialAttack, rangedAttack: RangedAttack) {
    this.name = name,
    this.weaponType = weaponType,
    this.damageType = damageType,
    this.twoHanded = twoHanded,
    this.attacks = attacks,
    this.specialAttack = specialAttack,
    this.rangedAttack = rangedAttack
  }

  bonusMult(target: Target): number {
    if (target === Target.VANGUARD_ARCHER) {
      return 1;
    }

    let type = this.damageType;
    if (type === DamageType.CHOP) {
      return target === Target.FOOTMAN ? 1.175 : 1.25;
    } else if (type === DamageType.BLUNT) {
      return target === Target.FOOTMAN ? 1.35 : 1.5;
    } else {
      return 1;
    }
  }

  maxPossibleBonus(): number {
    return Math.max(
      ...Object.values(Target).map((target) => this.bonusMult(target))
    );
  }

  extractNumber(path: string): number {
    var current:any = this;
    let parts = path.split(".");
    for(let part of parts) {
      if(part in current) {
        current = current[part];
      } else {
        throw Error("Invalid stat path specified. " + path);
      }
    }
    return current;
  }
}

export class SpecialAttack {
  range!: number
  windup!: number
  damage!: number

  constructor(range: number, windup: number, damage: number) {
    this.range = range;
    this.windup = windup;
    this.damage = damage;
  }
}

export class Swing {
  range!: number;
  altRange!: number;

  // TODO: Create AttackDuration class containing windup/active hitbox/cooldown
  light!: MeleeAttack
  heavy!: MeleeAttack

  constructor(range: number, altRange: number, light: MeleeAttack, heavy: MeleeAttack) {
    this.range = range;
    this.altRange = altRange;
    this.light = light;
    this.heavy = heavy;
  }
}

export class RangedAttack {
  projectileSpeed?: number; // probably not measured yet
  windup?: number; // milliseconds
  damage!: ProjectileDamage

  constructor(projectileSpeed: number, windup: number, damage: ProjectileDamage) {
    this.projectileSpeed = projectileSpeed;
    this.windup = windup;
    this.damage = damage;
  }
}

export class MeleeAttack {
  windup!: number;
  damage!: number; 

  constructor(windup: number, damage: number) {
    this.windup = windup;
    this.damage = damage;
  }
}

export class ProjectileDamage {
  head!: number;
  torso!: number;
  legs!: number;
  
  constructor(head: number, torso: number, legs: number) {
    this.head = head;
    this.torso = torso;
    this.legs = legs
  }
}

export enum DamageType {
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

export enum SwingType {
  HORIZONTAL = "horizontal",
  OVERHEAD = "overhead",
  STAB = "stab",
  SPECIAL = "special"
}

