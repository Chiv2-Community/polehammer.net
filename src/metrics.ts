import { extractNumber, Weapon } from "./weapon";

export enum MetricPath {
  WINDUP_SLASH = "attacks.slash.light.windup",
  WINDUP_OVERHEAD = "attacks.overhead.light.windup",
  WINDUP_STAB = "attacks.stab.light.windup",
  WINDUP_SPECIAL = "specialAttack.windup",

  RANGE_SLASH = "attacks.slash.range",
  RANGE_ALT_SLASH = "attacks.slash.altRange",
  RANGE_OVERHEAD = "attacks.overhead.range",
  RANGE_ALT_OVERHEAD = "attacks.overhead.altRange",
  RANGE_STAB = "attacks.stab.range",
  RANGE_ALT_STAB = "attacks.stab.altRange",
  // RANGE_SPECIAL = "specialAttack.range", TODO

  DAMAGE_SLASH_LIGHT = "attacks.slash.light.damage",
  DAMAGE_SLASH_HEAVY = "attacks.slash.heavy.damage",
  DAMAGE_OVERHEAD_LIGHT = "attacks.overhead.light.damage",
  DAMAGE_OVERHEAD_HEAVY = "attacks.overhead.heavy.damage",
  DAMAGE_STAB_LIGHT = "attacks.stab.light.damage",
  DAMAGE_STAB_HEAVY = "attacks.stab.heavy.damage",
  DAMAGE_SPECIAL = "specialAttack.damage",
  DAMAGE_CHARGE = "chargeAttack.damage",
  DAMAGE_LEAP = "leapAttack.damage",
  
  DAMAGE_RANGED_HEAD = "rangedAttack.damage.head",
  DAMAGE_RANGED_TORSO = "rangedAttack.damage.torso",
  DAMAGE_RANGED_LEGS = "rangedAttack.damage.legs",
}

// Metric Groups share the same units (damage/hitpoints, milliseconds, etc.)
// and are used to determine consistent min/max scales for normalization across categories
export enum Unit {
  INDEX = "Index",
  SPEED = "Milliseconds",
  RANGE = "Jeoffreys",
  DAMAGE = "Hitpoints"
}

export enum MetricLabel {
  DAMAGE_HEAVY_AVERAGE = "Damage - Average (Heavy)",
  DAMAGE_SLASH_HEAVY = "Damage - Slash (Heavy)",
  DAMAGE_OVERHEAD_HEAVY = "Damage - Overhead (Heavy)",
  DAMAGE_STAB_HEAVY = "Damage - Stab (Heavy)",

  DAMAGE_LIGHT_AVERAGE = "Damage - Average (Light)",
  DAMAGE_SLASH_LIGHT = "Damage - Slash (Light)",
  DAMAGE_OVERHEAD_LIGHT = "Damage - Overhead (Light)",
  DAMAGE_STAB_LIGHT = "Damage - Stab (Light)",

  DAMAGE_SPECIAL = "Damage - Special",
  DAMAGE_CHARGE = "Damage - Charge",
  DAMAGE_LEAP = "Damage - Leap",

  DAMAGE_RANGED_AVERAGE = "Thrown Damage - Average",
  DAMAGE_RANGED_HEAD = "Thrown Damage - Head",
  DAMAGE_RANGED_TORSO = "Thrown Damage - Torso",
  DAMAGE_RANGED_LEGS = "Thrown Damage - Legs",

  RANGE_AVERAGE = "Range - Average*",
  RANGE_SLASH = "Range - Slash",
  RANGE_ALT_SLASH = "Range - Alt. Slash",
  RANGE_OVERHEAD = "Range - Overhead",
  RANGE_ALT_OVERHEAD = "Range - Alt. Overhead",
  RANGE_STAB = "Range - Stab",
  RANGE_ALT_STAB = "Range - Alt. Stab",
  // RANGE_SPECIAL = "Range - Special", TODO

  SPEED_AVERAGE = "Speed - Average",
  SPEED_SLASH = "Speed - Slash",
  SPEED_OVERHEAD = "Speed - Overhead",
  SPEED_STAB = "Speed - Stab",
  SPEED_SPECIAL = "Speed - Special",
  // SPEED_MAX = "Speed - Max",
  POLEHAMMER_INDEX = "Index - Polehammer"
}

export function unitGroup(path: MetricPath) {
  if (path.includes(".damage")) {
    return Unit.DAMAGE;
  } else if (path.includes(".windup")) {
    return Unit.SPEED;
  } else if (path.includes(".range") || path.includes(".altRange")) {
    return Unit.RANGE;
  }
  throw `Invalid path: ${path}`;
}

export const DAMAGE_METRICS = Object.values(MetricPath).filter(
  (m) => unitGroup(m) === Unit.DAMAGE
);

export const RANGE_METRICS = Object.values(MetricPath).filter(
  (m) => unitGroup(m) === Unit.RANGE
);

export const SPEED_METRICS = Object.values(MetricPath).filter(
  (m) => unitGroup(m) === Unit.SPEED
);

export type LabelledMetrics = Map<
  MetricLabel,
  {
    unit: Unit;
    value: MetricResult;
  }
>;

export type MetricResult = {result: number; rawResult: number; }

export abstract class Metric {
  name: MetricLabel;
  unit: Unit;

  constructor(name: MetricLabel, unit: Unit) {
    this.name = name;
    this.unit = unit;
  }

  abstract calculate(weapon: Weapon): MetricResult;
}

export class AggregateMetric extends Metric {
  paths: MetricPath[];
  aggregateFunction: (nums: number[]) => number;
  
  constructor(
    name: MetricLabel,
    paths: MetricPath[],
    aggregateFunc: (nums: number[]) => number,
    unit: Unit|null = null
  ) {
    if(unit == null)
      unit = unitGroup(paths[0]);
    super(name, unit);
    this.paths = paths;
    this.aggregateFunction = aggregateFunc;
  }

  calculate(weapon: Weapon): MetricResult {
    let result = this.aggregateFunction(
      this.paths.map((prop) => extractNumber(weapon, prop))
    );

    return {
      result: result,
      rawResult: result,
    }
  }
}

export class BasicMetric extends Metric {
  path: string;

  constructor(name: MetricLabel, path: MetricPath) {
    super(name, unitGroup(path));
    this.path = path;
  }

  calculate(weapon: Weapon): MetricResult {
    let result = extractNumber(weapon, this.path)
    return {
      result: result,
      rawResult: result,
    }
  }
}

export class InverseMetric extends Metric {
  path: string;

  constructor(name: MetricLabel, path: MetricPath) {
    super(name, unitGroup(path));
    this.path = path;
  }

  calculate(weapon: Weapon): MetricResult {
    let rawResult = extractNumber(weapon, this.path);
    return {
      result: 1/rawResult,
      rawResult: rawResult
    }
  }
}

export class AggregateInverseMetric extends Metric {
  paths: MetricPath[];
  aggregateFunction: (n: number[]) => number;

  constructor(
    name: MetricLabel,
    paths: MetricPath[],
    aggregateFunc: (n: number[]) => number
  ) {
    super(name, unitGroup(paths[0]));
    this.paths = paths;
    this.aggregateFunction = aggregateFunc;
  }

  calculate(weapon: Weapon): MetricResult {
    let rawResult = this.aggregateFunction(
      this.paths.map((prop) => extractNumber(weapon, prop))
    );

    return {
      result: 1 / rawResult,
      rawResult: rawResult,
    }
  }
}
