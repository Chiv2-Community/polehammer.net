import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 19],
  [Metric.DURATION_OVERHEAD, 15],
  [Metric.DURATION_STAB, 19],
  [Metric.DURATION_SPECIAL, 21],
]);

export default metrics;
