let categoryPresetsBuilder: Map<string, MetricLabel[]> = new Map()

categoryPresets.set("Windup", [
  MetricLabel.WINDUP_SLASH_LIGHT,
  MetricLabel.WINDUP_SLASH_HEAVY,
  MetricLabel.WINDUP_OVERHEAD_LIGHT,
  MetricLabel.WINDUP_OVERHEAD_HEAVY,
  MetricLabel.WINDUP_STAB_LIGHT,
  MetricLabel.WINDUP_STAB_HEAVY,
  MetricLabel.WINDUP_SPECIAL,
  MetricLabel.WINDUP_LEAPING_STRIKE,
  MetricLabel.WINDUP_THROW,
])

categoryPresets.set("Release", [
  MetricLabel.RELEASE_SLASH_LIGHT,
  MetricLabel.RELEASE_SLASH_HEAVY,
  MetricLabel.RELEASE_OVERHEAD_LIGHT,
  MetricLabel.RELEASE_OVERHEAD_HEAVY,
  MetricLabel.RELEASE_STAB_LIGHT,
  MetricLabel.RELEASE_STAB_HEAVY,
  MetricLabel.RELEASE_SPECIAL,
  MetricLabel.RELEASE_LEAPING_STRIKE,
  MetricLabel.RELEASE_THROW,
])

categoryPresets.set("Recovery", [
  MetricLabel.RECOVERY_SLASH_LIGHT,
  MetricLabel.RECOVERY_SLASH_HEAVY,
  MetricLabel.RECOVERY_OVERHEAD_LIGHT,
  MetricLabel.RECOVERY_OVERHEAD_HEAVY,
  MetricLabel.RECOVERY_STAB_LIGHT,
  MetricLabel.RECOVERY_STAB_HEAVY,
  MetricLabel.RECOVERY_SPECIAL,
  MetricLabel.RECOVERY_THROW,
])

categoryPresets.set("Combo", [
  MetricLabel.COMBO_SLASH_LIGHT,
  MetricLabel.COMBO_SLASH_HEAVY,
  MetricLabel.COMBO_OVERHEAD_LIGHT,
  MetricLabel.COMBO_OVERHEAD_HEAVY,
  MetricLabel.COMBO_STAB_LIGHT,
  MetricLabel.COMBO_STAB_HEAVY,
  MetricLabel.COMBO_LEAPING_STRIKE,
])

categoryPresets.set("All Damage", [
  MetricLabel.DAMAGE_SLASH_LIGHT,
  MetricLabel.DAMAGE_SLASH_HEAVY,
  MetricLabel.DAMAGE_OVERHEAD_LIGHT,
  MetricLabel.DAMAGE_OVERHEAD_HEAVY,
  MetricLabel.DAMAGE_STAB_LIGHT,
  MetricLabel.DAMAGE_STAB_HEAVY,
  MetricLabel.DAMAGE_SPECIAL,
  MetricLabel.DAMAGE_LEAPING_STRIKE,
  MetricLabel.DAMAGE_THROW,
])

categoryPresets.set("Light Damage", [
  MetricLabel.DAMAGE_SLASH_LIGHT,
  MetricLabel.DAMAGE_OVERHEAD_LIGHT,
  MetricLabel.DAMAGE_STAB_LIGHT,
])

categoryPresets.set("Heavy Damage", [
  MetricLabel.DAMAGE_SLASH_HEAVY,
  MetricLabel.DAMAGE_OVERHEAD_HEAVY,
  MetricLabel.DAMAGE_STAB_HEAVY,
])

categoryPresets.set("Range", [
  MetricLabel.RANGE_SLASH,
  MetricLabel.RANGE_ALT_SLASH,
  MetricLabel.RANGE_OVERHEAD,
  MetricLabel.RANGE_ALT_OVERHEAD,
  MetricLabel.RANGE_STAB,
  MetricLabel.RANGE_ALT_STAB,
])

categoryPresets.set("Slash", [
  MetricLabel.DAMAGE_SLASH_LIGHT,
  MetricLabel.DAMAGE_SLASH_HEAVY,
  MetricLabel.RANGE_SLASH,
  MetricLabel.RANGE_ALT_SLASH,
  MetricLabel.WINDUP_SLASH_LIGHT,
  MetricLabel.WINDUP_SLASH_HEAVY,
  MetricLabel.RELEASE_SLASH_LIGHT,
  MetricLabel.RELEASE_SLASH_HEAVY,
  MetricLabel.RECOVERY_SLASH_LIGHT,
  MetricLabel.RECOVERY_SLASH_HEAVY,
  MetricLabel.COMBO_SLASH_LIGHT,
  MetricLabel.COMBO_SLASH_HEAVY,
])

categoryPresets.set("Overhead", [
  MetricLabel.DAMAGE_OVERHEAD_LIGHT,
  MetricLabel.DAMAGE_OVERHEAD_HEAVY,
  MetricLabel.RANGE_OVERHEAD,
  MetricLabel.RANGE_ALT_OVERHEAD,
  MetricLabel.WINDUP_OVERHEAD_LIGHT,
  MetricLabel.WINDUP_OVERHEAD_HEAVY,
  MetricLabel.RELEASE_OVERHEAD_LIGHT,
  MetricLabel.RELEASE_OVERHEAD_HEAVY,
  MetricLabel.RECOVERY_OVERHEAD_LIGHT,
  MetricLabel.RECOVERY_OVERHEAD_HEAVY,
  MetricLabel.COMBO_OVERHEAD_LIGHT,
  MetricLabel.COMBO_OVERHEAD_HEAVY,
])

categoryPresets.set("Stab", [
  MetricLabel.DAMAGE_STAB_LIGHT,
  MetricLabel.DAMAGE_STAB_HEAVY,
  MetricLabel.RANGE_STAB,
  MetricLabel.RANGE_ALT_STAB,
  MetricLabel.WINDUP_STAB_LIGHT,
  MetricLabel.WINDUP_STAB_HEAVY,
  MetricLabel.RELEASE_STAB_LIGHT,
  MetricLabel.RELEASE_STAB_HEAVY,
  MetricLabel.RECOVERY_STAB_LIGHT,
  MetricLabel.RECOVERY_STAB_HEAVY,
  MetricLabel.COMBO_STAB_LIGHT,
  MetricLabel.COMBO_STAB_HEAVY,
])

categoryPresets.set("Throw", [
  MetricLabel.DAMAGE_THROW,
  MetricLabel.WINDUP_THROW,
  MetricLabel.RELEASE_THROW,
  MetricLabel.RECOVERY_THROW,
])

categoryPresets.set("Special", [
  MetricLabel.DAMAGE_SPECIAL,
  MetricLabel.WINDUP_SPECIAL,
  MetricLabel.RELEASE_SPECIAL,
  MetricLabel.RECOVERY_SPECIAL,
])

categoryPresets.set("Leaping Strike", [
  MetricLabel.DAMAGE_LEAPING_STRIKE,
  MetricLabel.WINDUP_LEAPING_STRIKE,
  MetricLabel.RELEASE_LEAPING_STRIKE,
  MetricLabel.COMBO_LEAPING_STRIKE,
])

categoryPresets.set("Sprint Charge", [
  MetricLabel.DAMAGE_SPRINT_CHARGE,
])

categoryPresets.set("Average", [
  MetricLabel.DAMAGE_LIGHT_AVERAGE,
  MetricLabel.DAMAGE_HEAVY_AVERAGE,
  MetricLabel.WINDUP_LIGHT_AVERAGE,
  MetricLabel.WINDUP_HEAVY_AVERAGE,
  MetricLabel.RELEASE_LIGHT_AVERAGE,
  MetricLabel.RELEASE_HEAVY_AVERAGE,
  MetricLabel.RECOVERY_LIGHT_AVERAGE,
  MetricLabel.RECOVERY_HEAVY_AVERAGE,
  MetricLabel.COMBO_LIGHT_AVERAGE,
  MetricLabel.COMBO_HEAVY_AVERAGE,
  MetricLabel.RANGE_AVERAGE,
  MetricLabel.RANGE_ALT_AVERAGE
])

export const categoryPresets = categoryPresetsBuilder
