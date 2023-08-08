import { bonusMult, DamageType, MeleeAttack, SpecialAttack, Swing, Target, Weapon } from "chivalry2-weapons";

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
    let values = 
      weapons
        .map(w => this.generate(w, t, numTargets, horsebackDamageMult))
        .filter(v => v > 0) // ignore -1 and 0 values when making a min/max
        
    let min = Math.min(...values);
    let max = Math.max(...values);
    return {min: min, max: max};
  }
}

function generateCommonMetricsForAttack(idPrefix: string, label: string, cleave: (w: Weapon) => boolean, getAttack: (w: Weapon) => MeleeAttack | SpecialAttack): Metric[] {

  return [
    new Metric(idPrefix + "d", `Damage - ${label}`, Unit.DAMAGE, true, (w, t, numTargets, horsebackDamageMult) => horsebackDamageMult * bonusMult(numTargets, t, w.damageType, cleave(w)) * getAttack(w).damage),
    new Metric(idPrefix + "w", `Windup - ${label}`, Unit.SPEED, false, (w) => getAttack(w).windup),
    new Metric(idPrefix + "rl",`Release - ${label}`, Unit.SPEED, true, (w) => getAttack(w).release),
    new Metric(idPrefix + "rc",`Recovery - ${label}`, Unit.SPEED, false, (w) => getAttack(w).recovery),
    new Metric(idPrefix + "c", `Combo - ${label}`, Unit.SPEED, false, (w) => getAttack(w).combo),
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

  ...generateCommonMetricsForAttack("stl", "Stab (Light)", w => w.attacks.stab.light.cleaveOverride || true, w => w.attacks.stab.light),
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

// Metric Groups share the same units (damage/hitpoints, milliseconds, etc.)
// and are used to determine consistent min/max scales for normalization across categories
export enum Unit {
  INDEX = "Index",
  SPEED = "Milliseconds",
  RANGE = "Jeoffreys",
  DAMAGE = "Hitpoints",
  RANK = "Rank"
}