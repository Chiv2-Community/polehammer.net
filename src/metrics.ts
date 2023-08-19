import { ALL_TARGETS, AVERAGE, DamageType, MeleeAttack, SpecialAttack, Swing, Target, Weapon } from "chivalry2-weapons";

type GenerateMetricValue = (w: Weapon, t: Target, numTargets: number, horsebackDamageMult: number) => number;

export type Range = { min: number; max: number; };

export class Metric {
  id: string[];
  idString: string;
  label: string;
  higherIsBetter: boolean;
  generate: GenerateMetricValue;

  constructor(id: string[], label: string, higherIsBetter: boolean, generate: GenerateMetricValue) {
    this.id = id;
    this.label = label;
    this.higherIsBetter = higherIsBetter;
    this.generate = generate;

    this.idString = id.join("");
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

  mapGenerate(f: (original: number) => number): Metric {
    return new Metric(this.id, this.label, this.higherIsBetter, (w, t, numTargets, horsebackDamageMult) => f(this.generate(w, t, numTargets, horsebackDamageMult)));
  }
}

function averageMetric(id: string[], label: string, metrics: Metric[]): Metric {
  const [, ...idSuffix] = id;
  const validMetrics = metrics.filter(m => m.id.slice(-idSuffix.length).join(".") == idSuffix.join("."));

  return new Metric(
    id, 
    label,
    validMetrics.every(m => m.higherIsBetter),
    (w, t, numTargets, horsebackDamageMult) => {
      let sum = validMetrics.reduce((acc, m) => acc + m.generate(w, t, numTargets, horsebackDamageMult), 0);
      return sum / validMetrics.length;
    }
  )

}

function generateCommonMetricsForAttack(id: string[], label: string, cleave: (w: Weapon) => boolean, getAttack: (w: Weapon) => MeleeAttack | SpecialAttack): Metric[] {
  function calcDamage(w: Weapon, target: Target, numTargets: number, horsebackDamageMult: number): number {
    let attack = getAttack(w);
    let damageTypeMultiplier = target.damageMultiplier(attack.damageTypeOverride || w.damageType);
    let cleaveMultiplier = cleave(w) ? numTargets : 1;
    return getAttack(w).damage * damageTypeMultiplier * cleaveMultiplier * horsebackDamageMult;
  }
  
  function calcHitsToKill(w: Weapon, target: Target, numTargets: number, horsebackDamageMult: number): number {
    if(target == AVERAGE) {
      let nonAverageTargets = ALL_TARGETS.filter(t => t != AVERAGE);
      let hitsToKillSum = nonAverageTargets.reduce((acc, t) => acc + calcHitsToKill(w, t, numTargets, horsebackDamageMult), 0);
      return Math.ceil(hitsToKillSum / nonAverageTargets.length);
    } 

    let attack = getAttack(w);
    let damageTypeMultiplier = target.damageMultiplier(attack.damageTypeOverride || w.damageType);
    return Math.ceil(target.hp / (getAttack(w).damage * damageTypeMultiplier * horsebackDamageMult));
  }
  
  function calcStaminaDamage(w: Weapon, numTargets: number, horsebackDamageMult: number): number {
    let attack = getAttack(w);
    let cleaveMultiplier = cleave(w) ? numTargets : 1;
    return attack.staminaDamage * cleaveMultiplier * horsebackDamageMult;
  }

  return [
    new Metric(id.concat(["d"]), `Damage - ${label}`, true, calcDamage),
    new Metric(id.concat(["htk"]), `Hits To Kill - ${label}`, false, calcHitsToKill).mapGenerate(v => Math.ceil(v)),
    new Metric(id.concat(["sd"]), `Stamina Damage - ${label}`, true, (w, _, targets, horsebackMult) => calcStaminaDamage(w, targets, horsebackMult)),
    new Metric(id.concat(["w"]), `Windup - ${label}`, false, (w) => getAttack(w).windup),
    new Metric(id.concat(["rp"]), `Riposte - ${label}`, false, (w) => getAttack(w).riposte),
    new Metric(id.concat(["rl"]),`Release - ${label}`, true, (w) => getAttack(w).release),
    new Metric(id.concat(["rc"]),`Recovery - ${label}`, false, (w) => getAttack(w).recovery),
    new Metric(id.concat(["c"]), `Combo - ${label}`, false, (w) => getAttack(w).combo),
    new Metric(id.concat(["h"]), `Holding - ${label}`, false, (w) => getAttack(w).holding),
    new Metric(id.concat(["tls"]), `Turn Limit Strength - ${label}`, false, (w) => getAttack(w).turnLimitStrength),

    // These are the same for everything
    // new Metric(idPrefix + "vtls", `Vertical Turn Limit Strength - ${label}`, Unit.SPEED, false, (w) => getAttack(w).verticalTurnLimitStrength),
    // new Metric(idPrefix + "rtls", `Reverse Turn Limit Strength - ${label}`, Unit.SPEED, false, (w) => getAttack(w).reverseTurnLimitStrength),
  ];
}

function generateRangeMetrics(id: string[], label: string, getSwing: (w: Weapon) => Swing) {
  return [
    new Metric(id.concat("r"), `Range - ${label}`, true, w => getSwing(w).range),
    new Metric(id.concat("ar"), `Alt Range - ${label}`, true, w => getSwing(w).altRange),
  ];
}

function damageTypeLightCleave(dt: DamageType) {
  return dt == DamageType.CHOP || dt == DamageType.CUT;
}

function lightCleaves(dt: DamageType, attack: MeleeAttack | SpecialAttack) {
  return attack.cleaveOverride || damageTypeLightCleave(dt);
}

const baseMetrics = [
  new Metric(["sdn"], "Stamina Damage Negation", true, (w) => w.staminaDamageNegation || 0),

  ...generateCommonMetricsForAttack(["s", "l"], "Slash (Light)", w => lightCleaves(w.damageType, w.attacks.slash.light), w => w.attacks.slash.light),
  ...generateCommonMetricsForAttack(["s", "h"], "Slash (Heavy)", w => w.attacks.slash.heavy.cleaveOverride || true, w => w.attacks.slash.heavy),
  ...generateRangeMetrics(["s"], "Slash", w => w.attacks.slash),

  ...generateCommonMetricsForAttack(["o", "l"], "Overhead (Light)", w => lightCleaves(w.damageType, w.attacks.overhead.light), w => w.attacks.overhead.light),
  ...generateCommonMetricsForAttack(["o", "h"], "Overhead (Heavy)", w => w.attacks.overhead.heavy.cleaveOverride || true, w => w.attacks.overhead.heavy),
  ...generateRangeMetrics(["o"], "Overhead", w => w.attacks.overhead),

  ...generateCommonMetricsForAttack(["st", "l"], "Stab (Light)", w => w.attacks.stab.light.cleaveOverride || true, w => w.attacks.stab.light),
  ...generateCommonMetricsForAttack(["st", "h"], "Stab (Heavy)", w => w.attacks.stab.heavy.cleaveOverride || true, w => w.attacks.stab.heavy),
  ...generateRangeMetrics(["st"], "Stab", w => w.attacks.stab),

  ...generateCommonMetricsForAttack(["sp"], "Special", _ => false, w => w.attacks.special),
  ...generateCommonMetricsForAttack(["la"], "Leaping Strike", _ => false, w => w.attacks.sprintAttack),
  ...generateCommonMetricsForAttack(["sc"], "Sprint Charge", _ => false, w => w.attacks.sprintCharge),
  ...generateCommonMetricsForAttack(["t"], "Throw", _ => false, w => w.attacks.throw),
]

// N.B.: We don't use the average attack from the weapon because it doesn't take into account
//       the idea that some attacks may cleave while others don't. It just assumes that either
//       all attacks cleave or none do.  This, in conjunection with the number of targets 
//       setting means that we must re-calculate averages for at least damage related metrics.
//
//       We could probably still use the average attack for things like windup, release, and range
//       but I like being consistent.
const averageAttackMetrics = [
  averageMetric(["a", "l", "d"], "Damage - Average (Light)", baseMetrics),
  averageMetric(["a", "l", "htk"], "Hits To Kill - Average (Light)", baseMetrics),
  averageMetric(["a", "l", "sd"], "Stamina Damage - Average (Light)", baseMetrics),
  averageMetric(["a", "l", "w"], "Windup - Average (Light)", baseMetrics),
  averageMetric(["a", "l", "rp"], "Riposte - Average (Light)", baseMetrics),
  averageMetric(["a", "l", "rl"], "Release - Average (Light)", baseMetrics),
  averageMetric(["a", "l", "rc"], "Recovery - Average (Light)", baseMetrics),
  averageMetric(["a", "l", "c"], "Combo - Average (Light)", baseMetrics),
  averageMetric(["a", "l", "h"], "Holding - Average (Light)", baseMetrics),
  averageMetric(["a", "l", "tls"], "Turn Limit Strength - Average (Light)", baseMetrics),
  
  averageMetric(["a", "h", "d"], "Damage - Average (Heavy)", baseMetrics),
  averageMetric(["a", "h", "htk"], "Hits To Kill - Average (Heavy)", baseMetrics),
  averageMetric(["a", "h", "sd"], "Stamina Damage - Average (Heavy)", baseMetrics),
  averageMetric(["a", "h", "w"], "Windup - Average (Heavy)", baseMetrics),
  averageMetric(["a", "h", "rp"], "Riposte - Average (Heavy)", baseMetrics),
  averageMetric(["a", "h", "rl"], "Release - Average (Heavy)", baseMetrics),
  averageMetric(["a", "h", "rc"], "Recovery - Average (Heavy)", baseMetrics),
  averageMetric(["a", "h", "c"], "Combo - Average (Heavy)", baseMetrics),
  averageMetric(["a", "h", "h"], "Holding - Average (Heavy)", baseMetrics),
  averageMetric(["a", "h", "tls"], "Turn Limit Strength - Average (Heavy)", baseMetrics),

  averageMetric(["a", "r"], "Range - Average", baseMetrics),
  averageMetric(["a", "ar"], "Alt Range - Average", baseMetrics)
]

export const METRICS: Metric[] = [
  ...baseMetrics,
  ...averageAttackMetrics,
];

export const METRIC_MAP = new Map<string, Metric>();
METRICS.forEach(m => METRIC_MAP.set(m.idString, m));

let acc: string[] = []
METRICS.map(m => m.idString).forEach((cur) => {
  if(acc.indexOf(cur) == -1) {
    acc.push(cur);
  } else {
    throw new Error(`Duplicate metric id: ${cur}`);
  }
})
