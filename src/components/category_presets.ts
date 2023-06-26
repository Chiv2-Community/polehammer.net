import { METRICS, NewMetric } from "../metrics"

let CATEGORY_PRESETS: Map<string, NewMetric[]> = new Map()

function buildPreset(s: string, ignore: string[] = []): NewMetric[] { 
  return METRICS.filter(x => x.label.toLowerCase().includes(s) && ignore.findIndex(i => x.label.toLowerCase().includes(i)) == -1)
}

CATEGORY_PRESETS.set("Average", buildPreset("average"))
CATEGORY_PRESETS.set("Average (Light)", buildPreset("average (light)"))
CATEGORY_PRESETS.set("Average (Heavy)", buildPreset("average (heavy)"))

CATEGORY_PRESETS.set("Slash", buildPreset("slash", ["holding"]));
CATEGORY_PRESETS.set("Slash (Light)", buildPreset("slash (light)", ["holding"]))
CATEGORY_PRESETS.set("Slash (Heavy)", buildPreset("slash (heavy)", ["holding"]))

CATEGORY_PRESETS.set("Overhead", buildPreset("overhead", ["holding"]));
CATEGORY_PRESETS.set("Overhead (Light)", buildPreset("overhead (light)", ["holding"]))
CATEGORY_PRESETS.set("Overhead (Heavy)", buildPreset("overhead (heavy)", ["holding"]))

CATEGORY_PRESETS.set("Stab", buildPreset("stab", ["holding"]));
CATEGORY_PRESETS.set("Stab (Light)", buildPreset("stab (light)", ["holding"]))
CATEGORY_PRESETS.set("Stab (Heavy)", buildPreset("stab (heavy)", ["holding"]))

CATEGORY_PRESETS.set("Throw", buildPreset("throw", ["combo"]))
CATEGORY_PRESETS.set("Special", buildPreset("special", ["combo", "holding"]));
CATEGORY_PRESETS.set("Leaping Strike", buildPreset("leaping strike", ["holding", "recovery"]));
CATEGORY_PRESETS.set("Sprint Charge", METRICS.filter(x => x.label.includes("Sprint Charge")).filter(x => x.label.includes("Damage")))


CATEGORY_PRESETS.set("Holding", buildPreset("holding"));
CATEGORY_PRESETS.set("Windup", buildPreset("windup"));
CATEGORY_PRESETS.set("Release", buildPreset("release"));
CATEGORY_PRESETS.set("Recovery", buildPreset("recovery"));
CATEGORY_PRESETS.set("Combo", buildPreset("combo"));
CATEGORY_PRESETS.set("All Damage", buildPreset("damage"));

CATEGORY_PRESETS.set("Light Damage", METRICS.filter(x => x.label.includes("Light")).filter(x => x.label.includes("Damage")))
CATEGORY_PRESETS.set("Heavy Damage", METRICS.filter(x => x.label.includes("Heavy")).filter(x => x.label.includes("Damage")))
CATEGORY_PRESETS.set("Range", buildPreset("range"))

export default CATEGORY_PRESETS;
