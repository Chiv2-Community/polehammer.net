import { Metric, Rating } from "../rating";

const rating: Rating = new Map([
  [Metric.DURATION_HORIZONTAL, 22],
  [Metric.DURATION_OVERHEAD, 22],
  [Metric.DURATION_STAB, 21],
  [Metric.DURATION_SPECIAL, 30],
]);

export default rating;
