import { extractNumber, Weapon } from "./weapon";

export enum MetricPath {
  WINDUP_HORIZONTAL = "attacks.horizontal.light.windup",
  WINDUP_OVERHEAD = "attacks.overhead.light.windup",
  WINDUP_STAB = "attacks.stab.light.windup",
  WINDUP_SPECIAL = "specialAttack.windup",

  RANGE_HORIZONTAL = "attacks.horizontal.range",
  RANGE_ALT_HORIZONTAL = "attacks.horizontal.altRange",
  RANGE_OVERHEAD = "attacks.overhead.range",
  RANGE_ALT_OVERHEAD = "attacks.overhead.altRange",
  RANGE_STAB = "attacks.stab.range",
  RANGE_ALT_STAB = "attacks.stab.altRange",
  // RANGE_SPECIAL = "specialAttack.range", TODO

  DAMAGE_HORIZONTAL_LIGHT = "attacks.horizontal.light.damage",
  DAMAGE_HORIZONTAL_HEAVY = "attacks.horizontal.heavy.damage",
  DAMAGE_OVERHEAD_LIGHT = "attacks.overhead.light.damage",
  DAMAGE_OVERHEAD_HEAVY = "attacks.overhead.heavy.damage",
  DAMAGE_STAB_LIGHT = "attacks.stab.light.damage",
  DAMAGE_STAB_HEAVY = "attacks.stab.heavy.damage",
  DAMAGE_SPECIAL = "specialAttack.damage",
}

// Metric Groups share the same units (damage/hitpoints, milliseconds, etc.)
// and are used to determine consistent min/max scales for normalization across categories
export enum Unit {
  SPEED = "Attacks Per Second",
  RANGE = "Knockbacks",
  DAMAGE = "Hitpoints",
}

export enum MetricLabel {
  DAMAGE_HORIZONTAL_LIGHT = "Damage - Horizontal (Light)",
  DAMAGE_HORIZONTAL_HEAVY = "Damage - Horizontal (Heavy)",
  DAMAGE_OVERHEAD_LIGHT = "Damage - Overhead (Light)",
  DAMAGE_OVERHEAD_HEAVY = "Damage - Overhead (Heavy)",
  DAMAGE_STAB_LIGHT = "Damage - Stab (Light)",
  DAMAGE_STAB_HEAVY = "Damage - Stab (Heavy)",
  DAMAGE_SPECIAL = "Damage - Special",
  DAMAGE_AVERAGE = "Damage - Average*",
  DAMAGE_MAX_LIGHT = "Damage - Max (Light)",
  DAMAGE_MAX_HEAVY = "Damage - Max (Heavy)",

  RANGE_HORIZONTAL = "Range - Horizontal",
  RANGE_ALT_HORIZONTAL = "Range - Alt. Horizontal",
  RANGE_OVERHEAD = "Range - Overhead",
  RANGE_ALT_OVERHEAD = "Range - Alt. Overhead",
  RANGE_STAB = "Range - Stab",
  RANGE_ALT_STAB = "Range - Alt. Stab",
  // RANGE_SPECIAL = "Range - Special", TODO
  RANGE_AVERAGE = "Range - Average*",
  RANGE_MAX = "Range - Max",

  SPEED_HORIZONTAL = "Speed - Horizontal",
  SPEED_OVERHEAD = "Speed - Overhead",
  SPEED_STAB = "Speed - Stab",
  SPEED_SPECIAL = "Speed - Special",
  SPEED_AVERAGE = "Speed - Average*",
  SPEED_MAX = "Speed - Max",
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
    value: number;
  }
>;

export abstract class Metric {
  name: MetricLabel;
  unit: Unit;

  constructor(name: MetricLabel, unit: Unit) {
    this.name = name;
    this.unit = unit;
  }

  abstract calculate(weapon: Weapon): number;
}

export class AggregateMetric extends Metric {
  paths: MetricPath[];
  aggregateFunction: (nums: number[]) => number;

  constructor(
    name: MetricLabel,
    paths: MetricPath[],
    aggregateFunc: (nums: number[]) => number
  ) {
    super(name, unitGroup(paths[0]));
    this.paths = paths;
    this.aggregateFunction = aggregateFunc;
  }

  calculate(weapon: Weapon): number {
    return this.aggregateFunction(
      this.paths.map((prop) => extractNumber(weapon, prop))
    );
  }
}

export class BasicMetric extends Metric {
  path: string;

  constructor(name: MetricLabel, path: MetricPath) {
    super(name, unitGroup(path));
    this.path = path;
  }

  calculate(weapon: Weapon): number {
    return extractNumber(weapon, this.path);
  }
}

export class InverseMetric extends Metric {
  path: string;

  constructor(name: MetricLabel, path: MetricPath) {
    super(name, unitGroup(path));
    this.path = path;
  }

  calculate(weapon: Weapon): number {
    return 1000 / extractNumber(weapon, this.path);
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

  calculate(weapon: Weapon): number {
    return this.aggregateFunction(
      this.paths.map((prop) => 1000 / extractNumber(weapon, prop))
    );
  }
}
