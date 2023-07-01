import { METRICS, Metric } from "../metrics"

let CATEGORY_PRESETS: Map<string, Metric[]> = new Map()

function buildPreset(s: string, options: {ignore: string[]} = {ignore: []}): Metric[] { 
  return METRICS.filter(x => x.label.toLowerCase().includes(s) && options.ignore.findIndex(i => x.label.toLowerCase().includes(i)) == -1)
}

CATEGORY_PRESETS.set("Average", buildPreset("average", {ignore: ["holding"]}))
CATEGORY_PRESETS.set("Average (Light)", buildPreset("average (light)", {ignore: ["holding"]}))
CATEGORY_PRESETS.set("Average (Heavy)", buildPreset("average (heavy)", {ignore: ["holding"]}))

CATEGORY_PRESETS.set("Slash", buildPreset("slash", {ignore: ["holding"]}));
CATEGORY_PRESETS.set("Slash (Light)", buildPreset("slash (light)", {ignore: ["holding"]}))
CATEGORY_PRESETS.set("Slash (Heavy)", buildPreset("slash (heavy)", {ignore: ["holding"]}))

CATEGORY_PRESETS.set("Overhead", buildPreset("overhead", {ignore: ["holding"]}));
CATEGORY_PRESETS.set("Overhead (Light)", buildPreset("overhead (light)", {ignore: ["holding"]}))
CATEGORY_PRESETS.set("Overhead (Heavy)", buildPreset("overhead (heavy)", {ignore: ["holding"]}))

CATEGORY_PRESETS.set("Stab", buildPreset("stab", {ignore: ["holding"]}));
CATEGORY_PRESETS.set("Stab (Light)", buildPreset("stab (light)", {ignore: ["holding"]}))
CATEGORY_PRESETS.set("Stab (Heavy)", buildPreset("stab (heavy)", {ignore: ["holding"]}))

CATEGORY_PRESETS.set("Throw", buildPreset("throw", {ignore: ["combo"]}))
CATEGORY_PRESETS.set("Special", buildPreset("special", {ignore: ["combo", "holding"]}));
CATEGORY_PRESETS.set("Leaping Strike", buildPreset("leaping strike", {ignore: ["holding", "recovery"]}));
CATEGORY_PRESETS.set("Sprint Charge", METRICS.filter(x => x.label.includes("Sprint Charge")).filter(x => x.label.includes("Damage")))


CATEGORY_PRESETS.set("Holding", buildPreset("holding"));
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

export default CATEGORY_PRESETS;
