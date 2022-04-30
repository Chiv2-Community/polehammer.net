import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 19],
  [Metric.DURATION_OVERHEAD, 15],
  [Metric.DURATION_STAB, 19],
  [Metric.DURATION_SPECIAL, 21],

  [Metric.RANGE_HORIZONTAL, 22],
  [Metric.RANGE_ALT_HORIZONTAL, 21],
  [Metric.RANGE_OVERHEAD, 21],
  [Metric.RANGE_ALT_OVERHEAD, 22],
  [Metric.RANGE_STAB, 25],
  [Metric.RANGE_ALT_STAB, 26],
]);

export default metrics;
