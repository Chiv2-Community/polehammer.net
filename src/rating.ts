export enum Metric {
  DURATION_HORIZONTAL = "Duration - Horizontal",
  DURATION_OVERHEAD = "Duration - Overhead",
  DURATION_STAB = "Duration - Stab",
  DURATION_SPECIAL = "Duration - Special",
}

export type Rating = Map<Metric, number>;
