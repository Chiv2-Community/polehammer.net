import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 22],
  [Metric.DURATION_OVERHEAD, 22],
  [Metric.DURATION_STAB, 21],
  [Metric.DURATION_SPECIAL, 30],

  [Metric.RANGE_HORIZONTAL, 23],
  [Metric.RANGE_ALT_HORIZONTAL, 23],
  [Metric.RANGE_OVERHEAD, 22],
  [Metric.RANGE_ALT_OVERHEAD, 23],
  [Metric.RANGE_STAB, 26],
  [Metric.RANGE_ALT_STAB, 27],
]);

export default metrics;
