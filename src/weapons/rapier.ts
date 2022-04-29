import { Metric, Rating } from "../rating";

const rating: Rating = new Map([
  [Metric.DURATION_HORIZONTAL, 19],
  [Metric.DURATION_OVERHEAD, 15],
  [Metric.DURATION_STAB, 19],
  [Metric.DURATION_SPECIAL, 21],
]);

export default rating;
