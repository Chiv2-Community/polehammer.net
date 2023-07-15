import { METRICS, Metric } from "../metrics"

let CATEGORY_PRESETS: Map<string, Metric[]> = new Map()

function buildPreset(s: string, options: {ignore: string[]} = {ignore: []}): Metric[] { 
  return METRICS.filter(x => x.label.toLowerCase().includes(s) && options.ignore.findIndex(i => x.label.toLowerCase().includes(i)) == -1)
}

function rangeMetrics(attackName: string): Metric[] {
  return METRICS.filter(x => x.label.toLowerCase().includes(attackName) && x.label.toLowerCase().includes("range"))
}

let BASE_ATTACK_IGNORES = ["holding", "combo"] 

let averageRange = rangeMetrics("average");
CATEGORY_PRESETS.set("Average (Light)", buildPreset("average (light)", { ignore: BASE_ATTACK_IGNORES }).concat(averageRange));
CATEGORY_PRESETS.set("Average (Heavy)", buildPreset("average (heavy)", { ignore: BASE_ATTACK_IGNORES }).concat(averageRange));

let slashRange = rangeMetrics("slash");
CATEGORY_PRESETS.set("Slash (Light)", buildPreset("slash (light)", {ignore: BASE_ATTACK_IGNORES}).concat(slashRange));
CATEGORY_PRESETS.set("Slash (Heavy)", buildPreset("slash (heavy)", {ignore: BASE_ATTACK_IGNORES}).concat(slashRange));

let overheadRange = rangeMetrics("overhead");
CATEGORY_PRESETS.set("Overhead (Light)", buildPreset("overhead (light)", {ignore: BASE_ATTACK_IGNORES}).concat(overheadRange));
CATEGORY_PRESETS.set("Overhead (Heavy)", buildPreset("overhead (heavy)", {ignore: BASE_ATTACK_IGNORES}).concat(overheadRange));

let stabRange = rangeMetrics("stab");
CATEGORY_PRESETS.set("Stab (Light)", buildPreset("stab (light)", {ignore: BASE_ATTACK_IGNORES}).concat(stabRange));
CATEGORY_PRESETS.set("Stab (Heavy)", buildPreset("stab (heavy)", {ignore: BASE_ATTACK_IGNORES}).concat(stabRange));

CATEGORY_PRESETS.set("Throw", buildPreset("throw", {ignore: ["combo", "turn limit strength"]}))
CATEGORY_PRESETS.set("Special", buildPreset("special", {ignore: ["combo", "holding"]}));
CATEGORY_PRESETS.set("Leaping Strike", buildPreset("leaping strike", {ignore: ["holding", "recovery", "riposte"]}));
CATEGORY_PRESETS.set("Sprint Charge", METRICS.filter(x => x.label.includes("Sprint Charge")).filter(x => x.label.includes("Damage")))


CATEGORY_PRESETS.set("Holding", buildPreset("holding"));
CATEGORY_PRESETS.set("Riposte", buildPreset("riposte"));
CATEGORY_PRESETS.set("Windup", buildPreset("windup"));
CATEGORY_PRESETS.set("Release", buildPreset("release"));
CATEGORY_PRESETS.set("Recovery", buildPreset("recovery"));
CATEGORY_PRESETS.set("Combo", buildPreset("combo"));

CATEGORY_PRESETS.set("All Damage", buildPreset("damage", {ignore: ["stamina"]}));
CATEGORY_PRESETS.set("Light Damage", METRICS.filter(x => x.label.includes("Light")).filter(x => x.label.includes("Damage")).filter(x => !x.label.includes("Stamina")))
CATEGORY_PRESETS.set("Heavy Damage", METRICS.filter(x => x.label.includes("Heavy")).filter(x => x.label.includes("Damage")).filter(x => !x.label.includes("Stamina")))

CATEGORY_PRESETS.set("All Stamina Damage", buildPreset("stamina damage"));
CATEGORY_PRESETS.set("Light Stamina Damage", METRICS.filter(x => x.label.includes("Light")).filter(x => x.label.includes("Stamina Damage")))
CATEGORY_PRESETS.set("Heavy Stamina Damage", METRICS.filter(x => x.label.includes("Heavy")).filter(x => x.label.includes("Stamina Damage")))

CATEGORY_PRESETS.set("Range", buildPreset("range"))

CATEGORY_PRESETS.set("Turn Limit Strength", buildPreset("turn limit strength"))

export default CATEGORY_PRESETS;
