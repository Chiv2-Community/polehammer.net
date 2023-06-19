import { extractNumber, Weapon } from "./weapon";

export enum MetricPath {
  HOLDING_AVERAGE_LIGHT  = "attacks.average.light.holding",
  HOLDING_SLASH_LIGHT    = "attacks.slash.light.holding",
  HOLDING_OVERHEAD_LIGHT = "attacks.overhead.light.holding",
  HOLDING_STAB_LIGHT     = "attacks.stab.light.holding",
  HOLDING_AVERAGE_HEAVY  = "attacks.average.heavy.holding",
  HOLDING_SLASH_HEAVY    = "attacks.slash.heavy.holding",
  HOLDING_OVERHEAD_HEAVY = "attacks.overhead.heavy.holding",
  HOLDING_STAB_HEAVY     = "attacks.stab.heavy.holding",
  HOLDING_SPECIAL        = "attacks.special.holding",
  HOLDING_LEAPING_STRIKE = "attacks.sprintAttack.holding",
  HOLDING_SPRINT_CHARGE  = "attacks.sprintCharge.holding",
  HOLDING_THROW          = "attacks.throw.holding",

  WINDUP_AVERAGE_LIGHT  = "attacks.average.light.windup",
  WINDUP_SLASH_LIGHT    = "attacks.slash.light.windup",
  WINDUP_OVERHEAD_LIGHT = "attacks.overhead.light.windup",
  WINDUP_AVERAGE_HEAVY  = "attacks.average.heavy.windup",
  WINDUP_STAB_LIGHT     = "attacks.stab.light.windup",
  WINDUP_SLASH_HEAVY    = "attacks.slash.heavy.windup",
  WINDUP_OVERHEAD_HEAVY = "attacks.overhead.heavy.windup",
  WINDUP_STAB_HEAVY     = "attacks.stab.heavy.windup",
  WINDUP_SPECIAL        = "attacks.special.windup",
  WINDUP_LEAPING_STRIKE = "attacks.sprintAttack.windup",
  WINDUP_SPRINT_CHARGE  = "attacks.sprintCharge.windup",
  WINDUP_THROW          = "attacks.throw.windup",
  
  RELEASE_AVERAGE_LIGHT  = "attacks.average.light.release",
  RELEASE_SLASH_LIGHT    = "attacks.slash.light.release",
  RELEASE_OVERHEAD_LIGHT = "attacks.overhead.light.release",
  RELEASE_STAB_LIGHT     = "attacks.stab.light.release",
  RELEASE_AVERAGE_HEAVY  = "attacks.average.heavy.release",
  RELEASE_SLASH_HEAVY    = "attacks.slash.heavy.release",
  RELEASE_OVERHEAD_HEAVY = "attacks.overhead.heavy.release",
  RELEASE_STAB_HEAVY     = "attacks.stab.heavy.release",
  RELEASE_SPECIAL        = "attacks.special.release",
  RELEASE_LEAPING_STRIKE = "attacks.sprintAttack.release",
  RELEASE_SPRINT_CHARGE  = "attacks.sprintCharge.release",
  RELEASE_THROW          = "attacks.throw.release",

  RECOVERY_AVERAGE_LIGHT  = "attacks.average.light.recovery",
  RECOVERY_SLASH_LIGHT    = "attacks.slash.light.recovery",
  RECOVERY_OVERHEAD_LIGHT = "attacks.overhead.light.recovery",
  RECOVERY_STAB_LIGHT     = "attacks.stab.light.recovery",
  RECOVERY_AVERAGE_HEAVY  = "attacks.average.heavy.recovery",
  RECOVERY_SLASH_HEAVY    = "attacks.slash.heavy.recovery",
  RECOVERY_OVERHEAD_HEAVY = "attacks.overhead.heavy.recovery",
  RECOVERY_STAB_HEAVY     = "attacks.stab.heavy.recovery",
  RECOVERY_SPECIAL        = "attacks.special.recovery",
  RECOVERY_LEAPING_STRIKE = "attacks.sprintAttack.recovery",
  RECOVERY_SPRINT_CHARGE  = "attacks.sprintCharge.recovery",
  RECOVERY_THROW          = "attacks.throw.recovery",
  
  COMBO_AVERAGE_LIGHT  = "attacks.average.light.combo",
  COMBO_SLASH_LIGHT    = "attacks.slash.light.combo",
  COMBO_OVERHEAD_LIGHT = "attacks.overhead.light.combo",
  COMBO_STAB_LIGHT     = "attacks.stab.light.combo",
  COMBO_AVERAGE_HEAVY  = "attacks.average.heavy.combo",
  COMBO_SLASH_HEAVY    = "attacks.slash.heavy.combo",
  COMBO_OVERHEAD_HEAVY = "attacks.overhead.heavy.combo",
  COMBO_STAB_HEAVY     = "attacks.stab.heavy.combo",
  COMBO_SPECIAL        = "attacks.special.combo",
  COMBO_LEAPING_STRIKE = "attacks.sprintAttack.combo",
  COMBO_SPRINT_CHARGE  = "attacks.sprintCharge.combo",
  COMBO_THROW          = "attacks.throw.combo",

  RANGE_AVERAGE = "attacks.average.range",
  RANGE_ALT_AVERAGE = "attacks.average.altRange",
  RANGE_SLASH = "attacks.slash.range",
  RANGE_ALT_SLASH = "attacks.slash.altRange",
  RANGE_OVERHEAD = "attacks.overhead.range",
  RANGE_ALT_OVERHEAD = "attacks.overhead.altRange",
  RANGE_STAB = "attacks.stab.range",
  RANGE_ALT_STAB = "attacks.stab.altRange",

  DAMAGE_AVERAGE_LIGHT  = "attacks.average.light.damage",
  DAMAGE_SLASH_LIGHT    = "attacks.slash.light.damage",
  DAMAGE_OVERHEAD_LIGHT = "attacks.overhead.light.damage",
  DAMAGE_STAB_LIGHT     = "attacks.stab.light.damage",
  DAMAGE_AVERAGE_HEAVY  = "attacks.average.heavy.damage",
  DAMAGE_SLASH_HEAVY    = "attacks.slash.heavy.damage",
  DAMAGE_OVERHEAD_HEAVY = "attacks.overhead.heavy.damage",
  DAMAGE_STAB_HEAVY     = "attacks.stab.heavy.damage",
  DAMAGE_SPECIAL        = "attacks.special.damage",
  DAMAGE_LEAPING_STRIKE = "attacks.sprintAttack.damage",
  DAMAGE_SPRINT_CHARGE = "attacks.sprintCharge.damage",
  DAMAGE_THROW          = "attacks.throw.damage",
}

// Metric Groups share the same units (damage/hitpoints, milliseconds, etc.)
// and are used to determine consistent min/max scales for normalization across categories
export enum Unit {
  INDEX = "Index",
  SPEED = "Milliseconds",
  INVERSE_SPEED = "-Milliseconds",
  RANGE = "Jeoffreys",
  DAMAGE = "Hitpoints",
  RANK = "Rank"
}

export enum MetricLabel {
  HOLDING_SLASH_LIGHT    = "Holding - Slash (Light)",
  HOLDING_SLASH_HEAVY    = "Holding - Slash (Heavy)",
  HOLDING_STAB_LIGHT     = "Holding - Stab (Light)",
  HOLDING_STAB_HEAVY     = "Holding - Stab (Heavy)",
  HOLDING_OVERHEAD_LIGHT = "Holding - Overhead (Light)",
  HOLDING_OVERHEAD_HEAVY = "Holding - Overhead (Heavy)",
  HOLDING_SPECIAL        = "Holding - Special",
  HOLDING_LEAPING_STRIKE = "Holding - Leaping Strike",
  HOLDING_SPRINT_CHARGE  = "Holding - Sprint Charge",
  HOLDING_THROW          = "Holding - Throw",

  WINDUP_LIGHT_AVERAGE  = "Windup - Average (Light)",
  WINDUP_HEAVY_AVERAGE  = "Windup - Average (Heavy)",
  WINDUP_SLASH_LIGHT    = "Windup - Slash (Light)",
  WINDUP_SLASH_HEAVY    = "Windup - Slash (Heavy)",
  WINDUP_STAB_LIGHT     = "Windup - Stab (Light)",
  WINDUP_STAB_HEAVY     = "Windup - Stab (Heavy)",
  WINDUP_OVERHEAD_LIGHT = "Windup - Overhead (Light)",
  WINDUP_OVERHEAD_HEAVY = "Windup - Overhead (Heavy)",
  WINDUP_SPECIAL        = "Windup - Special",
  WINDUP_LEAPING_STRIKE = "Windup - Leaping Strike",
  WINDUP_SPRINT_CHARGE  = "Windup - Sprint Charge",
  WINDUP_THROW          = "Windup - Throw",

  RELEASE_LIGHT_AVERAGE  = "Release - Average (Light)",
  RELEASE_HEAVY_AVERAGE  = "Release - Average (Heavy)",
  RELEASE_SLASH_LIGHT    = "Release - Slash (Light)",
  RELEASE_SLASH_HEAVY    = "Release - Slash (Heavy)",
  RELEASE_STAB_LIGHT     = "Release - Stab (Light)",
  RELEASE_STAB_HEAVY     = "Release - Stab (Heavy)",
  RELEASE_OVERHEAD_LIGHT = "Release - Overhead (Light)",
  RELEASE_OVERHEAD_HEAVY = "Release - Overhead (Heavy)",
  RELEASE_SPECIAL        = "Release - Special",
  RELEASE_LEAPING_STRIKE = "Release - Leaping Strike",
  RELEASE_SPRINT_CHARGE  = "Release - Sprint Charge",
  RELEASE_THROW          = "Release - Throw",

  RECOVERY_LIGHT_AVERAGE  = "Recovery - Average (Light)",
  RECOVERY_HEAVY_AVERAGE  = "Recovery - Average (Heavy)",
  RECOVERY_SLASH_LIGHT    = "Recovery - Slash (Light)",
  RECOVERY_SLASH_HEAVY    = "Recovery - Slash (Heavy)",
  RECOVERY_STAB_LIGHT     = "Recovery - Stab (Light)",
  RECOVERY_STAB_HEAVY     = "Recovery - Stab (Heavy)",
  RECOVERY_OVERHEAD_LIGHT = "Recovery - Overhead (Light)",
  RECOVERY_OVERHEAD_HEAVY = "Recovery - Overhead (Heavy)",
  RECOVERY_SPECIAL        = "Recovery - Special",
  RECOVERY_LEAPING_STRIKE = "Recovery - Leaping Strike",
  RECOVERY_SPRINT_CHARGE  = "Recovery - Sprint Charge",
  RECOVERY_THROW          = "Recovery - Throw",
  
  COMBO_LIGHT_AVERAGE  = "Combo - Average (Light)",
  COMBO_HEAVY_AVERAGE  = "Combo - Average (Heavy)",
  COMBO_SLASH_LIGHT    = "Combo - Slash (Light)",
  COMBO_SLASH_HEAVY    = "Combo - Slash (Heavy)",
  COMBO_STAB_LIGHT     = "Combo - Stab (Light)",
  COMBO_STAB_HEAVY     = "Combo - Stab (Heavy)",
  COMBO_OVERHEAD_LIGHT = "Combo - Overhead (Light)",
  COMBO_OVERHEAD_HEAVY = "Combo - Overhead (Heavy)",
  COMBO_SPECIAL        = "Combo - Special",
  COMBO_LEAPING_STRIKE = "Combo - Leaping Strike",
  COMBO_SPRINT_CHARGE  = "Combo - Sprint Charge",
  COMBO_THROW          = "Combo - Throw",
  
  DAMAGE_HEAVY_AVERAGE  = "Damage - Average (Heavy)",
  DAMAGE_LIGHT_AVERAGE  = "Damage - Average (Light)",
  DAMAGE_SLASH_LIGHT    = "Damage - Slash (Light)",
  DAMAGE_SLASH_HEAVY    = "Damage - Slash (Heavy)",
  DAMAGE_STAB_LIGHT     = "Damage - Stab (Light)",
  DAMAGE_STAB_HEAVY     = "Damage - Stab (Heavy)",
  DAMAGE_OVERHEAD_LIGHT = "Damage - Overhead (Light)",
  DAMAGE_OVERHEAD_HEAVY = "Damage - Overhead (Heavy)",
  DAMAGE_SPECIAL        = "Damage - Special",
  DAMAGE_LEAPING_STRIKE = "Damage - Leaping Strike",
  DAMAGE_SPRINT_CHARGE  = "Damage - Sprint Charge",
  DAMAGE_THROW          = "Damage - Throw",


  RANGE_AVERAGE = "Range - Average",
  RANGE_ALT_AVERAGE = "Range - Alt Average",
  RANGE_SLASH = "Range - Slash",
  RANGE_ALT_SLASH = "Range - Alt. Slash",
  RANGE_OVERHEAD = "Range - Overhead",
  RANGE_ALT_OVERHEAD = "Range - Alt. Overhead",
  RANGE_STAB = "Range - Stab",
  RANGE_ALT_STAB = "Range - Alt. Stab",
}

export function unitGroup(path: MetricPath) {
  if (path.includes(".damage")) {
    return Unit.DAMAGE;
  } else if (path.includes(".windup") || path.includes(".recovery") || path.includes(".combo") || path.includes(".holding")) {
    return Unit.INVERSE_SPEED;
  } else if (path.includes(".release")) {
    return Unit.SPEED;
  } else if (path.includes(".range") || path.includes(".altRange")) {
    return Unit.RANGE;
  } else if (path.includes(".rank")) {
    return Unit.RANK;
  }
  throw `Invalid path (${path}). Update the "unitGroup" function in metrics.ts`;
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

export const INVERSE_SPEED_METRICS = Object.values(MetricPath).filter(
  (m) => unitGroup(m) === Unit.INVERSE_SPEED
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

export class WeaponMetric extends Metric {
  func: (weapon: Weapon) => number;
  constructor(name: MetricLabel, unit: Unit, func: (weapon: Weapon) => number) {
    super(name, unit);
    this.func = func;
  }

  calculate(weapon: Weapon) {
    const result = this.func(weapon);
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
