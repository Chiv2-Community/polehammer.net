import { Weapon } from "./weapon";

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
  DAMAGE_SPECIAL = "specialAttack.damage"
}

export enum MetricLabel {
  WINDUP_HORIZONTAL = "Windup - Horizontal",
  WINDUP_OVERHEAD = "Windup - Overhead",
  WINDUP_STAB = "Windup - Stab",
  WINDUP_SPECIAL = "Windup - Special",
  WINDUP_AVERAGE = "Windup - Average*",

  RANGE_HORIZONTAL = "Range - Horizontal",
  RANGE_ALT_HORIZONTAL = "Range - Alt. Horizontal",
  RANGE_OVERHEAD = "Range - Overhead",
  RANGE_ALT_OVERHEAD = "Range - Alt. Overhead",
  RANGE_STAB = "Range - Stab",
  RANGE_ALT_STAB = "Range - Alt. Stab",
  // RANGE_SPECIAL = "Range - Special", TODO
  RANGE_AVERAGE = "Range - Average*",

  DAMAGE_HORIZONTAL_LIGHT = "Damage - Horizontal (Light)",
  DAMAGE_HORIZONTAL_HEAVY = "Damage - Horizontal (Heavy)",
  DAMAGE_OVERHEAD_LIGHT = "Damage - Overhead (Light)",
  DAMAGE_OVERHEAD_HEAVY = "Damage - Overhead (Heavy)",
  DAMAGE_STAB_LIGHT = "Damage - Stab (Light)",
  DAMAGE_STAB_HEAVY = "Damage - Stab (Heavy)",
  DAMAGE_SPECIAL = "Damage - Special",
  DAMAGE_AVERAGE = "Damage - Average*",
}

export const DAMAGE_METRICS = 
  Object.values(MetricPath)
    .filter((m) => m.includes(".damage"))

export const RANGE_METRICS = 
  Object.values(MetricPath)
    .filter((m) => m.includes(".range") || m.includes(".altRange"))

export const WINDUP_METRICS = 
  Object.values(MetricPath)
    .filter((m) => m.includes(".windup"))


export type LabelledMetrics = Map<MetricLabel, number>;


export abstract class Metric {
  name!: MetricLabel
  
  constructor(name: MetricLabel) {
    this.name = name;
  }

  abstract calculate(weapon: Weapon): number;
}

export class AggregateMetric extends Metric {
  paths!: MetricPath[];
  aggregateFunction!: (nums: number[]) => number;

  constructor(name: MetricLabel, paths: MetricPath[], aggregateFunc: (nums: number[]) => number) {
    super(name);
    this.paths = paths;
    this.aggregateFunction = aggregateFunc;
  }

  calculate(weapon: Weapon): number {
    return this.aggregateFunction(this.paths.map((prop) => weapon.extractNumber(prop)))
  }
}

export class BasicMetric extends Metric {
  path!: string;
  
  constructor(name: MetricLabel, path: MetricPath) {
    super(name);
    this.path = path;
  }

  calculate(weapon: Weapon): number {
    return weapon.extractNumber(this.path)
  }
}

export class InverseMetric extends Metric {
  path!: string;
  metricMin!: number;
  metricMax!: number;

  constructor(name: MetricLabel, path: MetricPath, metricMin: number, metricMax: number) {
    super(name);
    this.path = path;
    this.metricMin = metricMin;
    this.metricMax = metricMax;
  }

  calculate(weapon: Weapon): number {
    return this.metricMax + this.metricMin - weapon.extractNumber(this.path)
  }
}

export class AggregateInverseMetric extends Metric {
  paths!: MetricPath[];
  metricMin!: number;
  metricMax!: number;
  aggregateFunction!: (n: number[]) => number;

  constructor(name: MetricLabel, paths: MetricPath[], metricMin: number, metricMax: number, aggregateFunc: (n: number[]) => number) {
    super(name);
    this.paths = paths;
    this.metricMin = metricMin;
    this.metricMax = metricMax;
    this.aggregateFunction = aggregateFunc;
  }

  calculate(weapon: Weapon): number {
    const minPlusMax = this.metricMax + this.metricMin
    return this.aggregateFunction(this.paths.map((prop) => minPlusMax - weapon.extractNumber(prop)))
  }
}

