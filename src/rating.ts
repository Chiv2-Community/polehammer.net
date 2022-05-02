export enum Metric {
  DURATION_HORIZONTAL = "Duration - Horizontal",
  DURATION_OVERHEAD = "Duration - Overhead",
  DURATION_STAB = "Duration - Stab",
  DURATION_SPECIAL = "Duration - Special",

  RANGE_HORIZONTAL = "Range - Horizontal",
  RANGE_ALT_HORIZONTAL = "Range - Alt. Horizontal",
  RANGE_OVERHEAD = "Range - Overhead",
  RANGE_ALT_OVERHEAD = "Range - Alt. Overhead",
  RANGE_STAB = "Range - Stab",
  RANGE_ALT_STAB = "Range - Alt. Stab",

  DAMAGE_HORIZONTAL_LIGHT = "Damage - Horizontal (Light)",
  DAMAGE_HORIZONTAL_HEAVY = "Damage - Horizontal (Heavy)",
  DAMAGE_OVERHEAD_LIGHT = "Damage - Overhead (Light)",
  DAMAGE_OVERHEAD_HEAVY = "Damage - Overhead (Heavy)",
  DAMAGE_STAB_LIGHT = "Damage - Stab (Light)",
  DAMAGE_STAB_HEAVY = "Damage - Stab (Heavy)",
  DAMAGE_SPECIAL = "Damage - Special",
}

export enum Rating {
  SPEED_HORIZONTAL = "Speed - Horizontal",
  SPEED_OVERHEAD = "Speed - Overhead",
  SPEED_STAB = "Speed - Stab",
  SPEED_SPECIAL = "Speed - Special",
  SPEED_AVERAGE = "Speed - Average*",

  RANGE_HORIZONTAL = "Range - Horizontal",
  RANGE_ALT_HORIZONTAL = "Range - Alt. Horizontal",
  RANGE_OVERHEAD = "Range - Overhead",
  RANGE_ALT_OVERHEAD = "Range - Alt. Overhead",
  RANGE_STAB = "Range - Stab",
  RANGE_ALT_STAB = "Range - Alt. Stab",
  RANGE_AVERAGE = "Range - Average*",

  DAMAGE_HORIZONTAL_LIGHT = "Damage - Horizontal (Light)",
  DAMAGE_HORIZONTAL_HEAVY = "Damage - Horizontal (Heavy)",
  DAMAGE_OVERHEAD_LIGHT = "Damage - Overhead (Light)",
  DAMAGE_OVERHEAD_HEAVY = "Damage - Overhead (Heavy)",
  DAMAGE_STAB_LIGHT = "Damage - Stab (Light)",
  DAMAGE_STAB_HEAVY = "Damage - Stab (Heavy)",
  DAMAGE_SPECIAL = "Damage - Special",
  DAMAGE_AVERAGE = "Damage - Average*",
}

export type RawMetrics = Map<Metric, number>;
export type DerivedRatings = Map<Rating, number>;
