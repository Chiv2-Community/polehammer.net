import { MetricLabel } from "../metrics"

let CATEGORY_PRESETS: Map<string, MetricLabel[]> = new Map()

function buildPreset(s: string, ignore: MetricLabel[] = []): MetricLabel[] { 
  return Object.values(MetricLabel).filter(x => x.toLowerCase().includes(s)).filter(x => ignore.indexOf(x) == -1)
}

CATEGORY_PRESETS.set("Average", buildPreset("average"))
CATEGORY_PRESETS.set("Average (Light)", buildPreset("average (light)"))
CATEGORY_PRESETS.set("Average (Heavy)", buildPreset("average (heavy)"))

CATEGORY_PRESETS.set("Slash", buildPreset("slash", [MetricLabel.HOLDING_SLASH_LIGHT, MetricLabel.HOLDING_SLASH_HEAVY]));
CATEGORY_PRESETS.set("Slash (Light)", buildPreset("slash (light)", [MetricLabel.HOLDING_SLASH_LIGHT]))
CATEGORY_PRESETS.set("Slash (Heavy)", buildPreset("slash (heavy)", [MetricLabel.HOLDING_SLASH_HEAVY]))

CATEGORY_PRESETS.set("Overhead", buildPreset("overhead", [MetricLabel.HOLDING_OVERHEAD_LIGHT, MetricLabel.HOLDING_OVERHEAD_HEAVY]));
CATEGORY_PRESETS.set("Overhead (Light)", buildPreset("overhead (light)", [MetricLabel.HOLDING_OVERHEAD_LIGHT]))
CATEGORY_PRESETS.set("Overhead (Heavy)", buildPreset("overhead (heavy)", [MetricLabel.HOLDING_OVERHEAD_HEAVY]))

CATEGORY_PRESETS.set("Stab", buildPreset("stab", [MetricLabel.HOLDING_STAB_LIGHT, MetricLabel.HOLDING_STAB_HEAVY]));
CATEGORY_PRESETS.set("Stab (Light)", buildPreset("stab (light)", [MetricLabel.HOLDING_STAB_LIGHT]))
CATEGORY_PRESETS.set("Stab (Heavy)", buildPreset("stab (heavy)", [MetricLabel.HOLDING_STAB_HEAVY]))

CATEGORY_PRESETS.set("Throw", buildPreset("throw", [MetricLabel.COMBO_THROW]))
CATEGORY_PRESETS.set("Special", buildPreset("special", [MetricLabel.HOLDING_SPECIAL, MetricLabel.COMBO_SPECIAL]));
CATEGORY_PRESETS.set("Leaping Strike", buildPreset("leaping strike", [MetricLabel.HOLDING_LEAPING_STRIKE, MetricLabel.RECOVERY_LEAPING_STRIKE]));
CATEGORY_PRESETS.set("Sprint Charge", [MetricLabel.DAMAGE_SPRINT_CHARGE])


CATEGORY_PRESETS.set("Holding", buildPreset("holding"));
CATEGORY_PRESETS.set("Riposte", buildPreset("riposte"));
CATEGORY_PRESETS.set("Windup", buildPreset("windup"));
CATEGORY_PRESETS.set("Release", buildPreset("release"));
CATEGORY_PRESETS.set("Recovery", buildPreset("recovery"));
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
