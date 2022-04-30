import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 22],
  [Metric.DURATION_OVERHEAD, 22],
  [Metric.DURATION_STAB, 21],
  [Metric.DURATION_SPECIAL, 30],
]);

export default metrics;
