export enum Metric {
  DURATION_HORIZONTAL = "Duration - Horizontal",
  DURATION_OVERHEAD = "Duration - Overhead",
  DURATION_STAB = "Duration - Stab",
  DURATION_SPECIAL = "Duration - Special",
}

export enum Rating {
  SPEED_HORIZONTAL = "Speed - Horizontal",
  SPEED_OVERHEAD = "Speed - Overhead",
  SPEED_STAB = "Speed - Stab",
  SPEED_SPECIAL = "Speed - Special",
  SPEED_AVERAGE = "Speed - Average*",
}

export type RawMetrics = Map<Metric, number>;
export type DerivedRatings = Map<Rating, number>;
