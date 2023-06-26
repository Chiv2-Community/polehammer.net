import { MetricLabel } from "../metrics"

let CATEGORY_PRESETS: Map<string, MetricLabel[]> = new Map()

function buildPreset(s: string, options: {ignore: MetricLabel[]} = {ignore: []}): MetricLabel[] { 
  return Object.values(MetricLabel).filter(x => x.toLowerCase().includes(s)).filter(x => options.ignore.indexOf(x) == -1)
}

CATEGORY_PRESETS.set("Average", buildPreset("average"))
CATEGORY_PRESETS.set("Average (Light)", buildPreset("average (light)"))
CATEGORY_PRESETS.set("Average (Heavy)", buildPreset("average (heavy)"))

CATEGORY_PRESETS.set("Slash", buildPreset("slash", {ignore: [MetricLabel.HOLDING_SLASH_LIGHT, MetricLabel.HOLDING_SLASH_HEAVY]}));
CATEGORY_PRESETS.set("Slash (Light)", buildPreset("slash (light)", {ignore: [MetricLabel.HOLDING_SLASH_LIGHT]}))
CATEGORY_PRESETS.set("Slash (Heavy)", buildPreset("slash (heavy)", {ignore: [MetricLabel.HOLDING_SLASH_HEAVY]}))

CATEGORY_PRESETS.set("Overhead", buildPreset("overhead", {ignore: [MetricLabel.HOLDING_OVERHEAD_LIGHT, MetricLabel.HOLDING_OVERHEAD_HEAVY]}));
CATEGORY_PRESETS.set("Overhead (Light)", buildPreset("overhead (light)", {ignore: [MetricLabel.HOLDING_OVERHEAD_LIGHT]}))
CATEGORY_PRESETS.set("Overhead (Heavy)", buildPreset("overhead (heavy)", {ignore: [MetricLabel.HOLDING_OVERHEAD_HEAVY]}))

CATEGORY_PRESETS.set("Stab", buildPreset("stab", {ignore: [MetricLabel.HOLDING_STAB_LIGHT, MetricLabel.HOLDING_STAB_HEAVY]}));
CATEGORY_PRESETS.set("Stab (Light)", buildPreset("stab (light)", {ignore: [MetricLabel.HOLDING_STAB_LIGHT]}))
CATEGORY_PRESETS.set("Stab (Heavy)", buildPreset("stab (heavy)", {ignore: [MetricLabel.HOLDING_STAB_HEAVY]}))

CATEGORY_PRESETS.set("Throw", buildPreset("throw", {ignore: [MetricLabel.COMBO_THROW]}))
CATEGORY_PRESETS.set("Special", buildPreset("special", {ignore: [MetricLabel.HOLDING_SPECIAL, MetricLabel.COMBO_SPECIAL]}));
CATEGORY_PRESETS.set("Leaping Strike", buildPreset("leaping strike", {ignore: [MetricLabel.HOLDING_LEAPING_STRIKE, MetricLabel.RECOVERY_LEAPING_STRIKE]}));
CATEGORY_PRESETS.set("Sprint Charge", [MetricLabel.DAMAGE_SPRINT_CHARGE])


CATEGORY_PRESETS.set("Holding", buildPreset("holding"));
CATEGORY_PRESETS.set("Windup", buildPreset("windup"));
CATEGORY_PRESETS.set("Release", buildPreset("release"));
CATEGORY_PRESETS.set("Recovery", buildPreset("recovery"));
CATEGORY_PRESETS.set("Thwack", buildPreset("thwack"));
CATEGORY_PRESETS.set("Combo", buildPreset("combo"));
CATEGORY_PRESETS.set("All Damage", buildPreset("damage"));

CATEGORY_PRESETS.set("Light Damage", [
  MetricLabel.DAMAGE_SLASH_LIGHT,
  MetricLabel.DAMAGE_OVERHEAD_LIGHT,
  MetricLabel.DAMAGE_STAB_LIGHT,
])

CATEGORY_PRESETS.set("Heavy Damage", [
  MetricLabel.DAMAGE_SLASH_HEAVY,
  MetricLabel.DAMAGE_OVERHEAD_HEAVY,
  MetricLabel.DAMAGE_STAB_HEAVY,
])

CATEGORY_PRESETS.set("Range", buildPreset("range"))

export default CATEGORY_PRESETS;
