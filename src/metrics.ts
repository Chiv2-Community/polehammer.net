import { DamageType, MeleeAttack, SpecialAttack, Swing, Target, Weapon } from "chivalry2-weapons";

type GenerateMetricValue = (w: Weapon, t: Target, numTargets: number, horsebackDamageMult: number) => number;

export type Range = { min: number; max: number; };

export class Metric {
  id: string;
  label: string;
  unit: Unit;
  higherIsBetter: boolean;
  generate: GenerateMetricValue;

  constructor(id: string, label: string, unit: Unit, higherIsBetter: boolean, generate: GenerateMetricValue) {
    this.id = id;
    this.label = label;
    this.unit = unit;
    this.higherIsBetter = higherIsBetter;
    this.generate = generate;
  }

  getMinMax(weapons: Weapon[], t: Target, numTargets: number, horsebackDamageMult: number): Range {
    let values = weapons.map(w => this.generate(w, t, numTargets, horsebackDamageMult));
    let min = Math.min(...values);
    let max = Math.max(...values);
    return {min: min, max: max};
  }
}

function generateCommonMetricsForAttack(idPrefix: string, label: string, cleave: (w: Weapon) => boolean, getAttack: (w: Weapon) => MeleeAttack | SpecialAttack): Metric[] {
  function calcDamage(w: Weapon, target: Target, numTargets: number, horsebackDamageMult: number): number {
    let attack = getAttack(w);
    let damageTypeMultiplier = target.damageMultiplier(attack.damageTypeOverride || w.damageType);
    let cleaveMultiplier = cleave(w) ? numTargets : 1;
    return getAttack(w).damage * damageTypeMultiplier * cleaveMultiplier * horsebackDamageMult;
  }
  
  function calcStaminaDamage(w: Weapon, numTargets: number, horsebackDamageMult: number): number {
    let attack = getAttack(w);
    let cleaveMultiplier = cleave(w) ? numTargets : 1;
    return attack.staminaDamage * cleaveMultiplier * horsebackDamageMult;
  }

  return [
    new Metric(idPrefix + "d", `Damage - ${label}`, Unit.DAMAGE, true, calcDamage),
    new Metric(idPrefix + "sd", `Stamina Damage - ${label}`, Unit.DAMAGE, true, (w, _, targets, horsebackMult) => calcStaminaDamage(w, targets, horsebackMult)),
    new Metric(idPrefix + "w", `Windup - ${label}`, Unit.SPEED, false, (w) => getAttack(w).windup),
    new Metric(idPrefix + "rl",`Release - ${label}`, Unit.SPEED, true, (w) => getAttack(w).release),
    new Metric(idPrefix + "rc",`Recovery - ${label}`, Unit.SPEED, false, (w) => getAttack(w).recovery),
    new Metric(idPrefix + "c", `Combo - ${label}`, Unit.SPEED, false, (w) => getAttack(w).combo),
    new Metric(idPrefix + "t",`Thwack - ${label}`, Unit.SPEED, false, (w) => getAttack(w).thwack),
    new Metric(idPrefix + "h", `Holding - ${label}`, Unit.SPEED, false, (w) => getAttack(w).holding),
  ];
}

function generateRangeMetrics(idPrefix: string, label: string, getSwing: (w: Weapon) => Swing) {
  return [
    new Metric(idPrefix + "r", `Range - ${label}`, Unit.RANGE, true, w => getSwing(w).range),
    new Metric(idPrefix + "ar", `Alt Range - ${label}`, Unit.RANGE, true, w => getSwing(w).altRange),
  ];
}

function damageTypeLightCleave(dt: DamageType) {
  return dt == DamageType.CHOP || dt == DamageType.CUT;
}

function lightCleaves(dt: DamageType, attack: MeleeAttack | SpecialAttack) {
  return attack.cleaveOverride || damageTypeLightCleave(dt);
}

export const METRICS: Metric[] = [
  ...generateCommonMetricsForAttack("al", "Average (Light)", w => lightCleaves(w.damageType, w.attacks.average.light), w => w.attacks.average.light),
  ...generateCommonMetricsForAttack("ah", "Average (Heavy)", w => w.attacks.average.heavy.cleaveOverride || true, w => w.attacks.average.heavy),
  ...generateRangeMetrics("a", "Average", w => w.attacks.average),

  ...generateCommonMetricsForAttack("sl", "Slash (Light)", w => lightCleaves(w.damageType, w.attacks.slash.light), w => w.attacks.slash.light),
  ...generateCommonMetricsForAttack("sh", "Slash (Heavy)", w => w.attacks.slash.heavy.cleaveOverride || true, w => w.attacks.slash.heavy),
  ...generateRangeMetrics("s", "Slash", w => w.attacks.slash),

  ...generateCommonMetricsForAttack("ol", "Overhead (Light)", w => lightCleaves(w.damageType, w.attacks.overhead.light), w => w.attacks.overhead.light),
  ...generateCommonMetricsForAttack("oh", "Overhead (Heavy)", w => w.attacks.overhead.heavy.cleaveOverride || true, w => w.attacks.overhead.heavy),
  ...generateRangeMetrics("o", "Overhead", w => w.attacks.overhead),

  ...generateCommonMetricsForAttack("stl", "Stab (Light)", w => lightCleaves(w.damageType, w.attacks.stab.light), w => w.attacks.stab.light),
  ...generateCommonMetricsForAttack("sth", "Stab (Heavy)", w => w.attacks.stab.heavy.cleaveOverride || true, w => w.attacks.stab.heavy),
  ...generateRangeMetrics("st", "Stab", w => w.attacks.stab),

  ...generateCommonMetricsForAttack("sp", "Special", _ => false, w => w.attacks.special),
  ...generateCommonMetricsForAttack("la", "Leaping Strike", _ => false, w => w.attacks.sprintAttack),
  ...generateCommonMetricsForAttack("sc", "Sprint Charge", _ => false, w => w.attacks.sprintCharge),
  ...generateCommonMetricsForAttack("t", "Throw", _ => false, w => w.attacks.throw),
];

export const METRIC_MAP = new Map<string, Metric>();
METRICS.forEach(m => METRIC_MAP.set(m.id, m));

let acc: string[] = []
METRICS.map(m => m.id).forEach((cur) => {
  if(acc.indexOf(cur) == -1) {
    acc.push(cur);
  } else {
    throw new Error(`Duplicate metric id: ${cur}`);
  }
})

export enum Unit {
  INDEX = "Index",
  SPEED = "Milliseconds",
  RANGE = "Jeoffreys",
  DAMAGE = "Hitpoints",
  RANK = "Rank"
}