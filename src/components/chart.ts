import { BubbleDataPoint, Chart, ChartConfiguration, ChartData, ChartTypeRegistry, ScatterDataPoint } from "chart.js";

export abstract class BaseChart {
    chartElement: HTMLCanvasElement;
    chart: Chart | undefined;
    
    abstract makeChartConfig(data: ChartData): ChartConfiguration

    constructor(elementOrSelector: string | HTMLCanvasElement) {
        if (typeof elementOrSelector === "string") {
            let maybeChartElement = document.querySelector<HTMLCanvasElement>(elementOrSelector);
            if (!maybeChartElement) {
                throw new Error("Invalid selector provided: " + elementOrSelector);
            }
            this.chartElement = maybeChartElement!;
        } else {
            this.chartElement = elementOrSelector;
        }

        this.chart = undefined;
    }

    
    render(data: ChartData): void {
        if(this.chart) {
            this.chart.data = data
            this.chart.update();
        } else {
            this.chart = new Chart(
                this.chartElement,
                this.makeChartConfig(data)
            )
            this.chart.update();
        }
    }

    destroy(): void {
        if(this.chart) {
            this.chart.destroy();
            this.chart = undefined;
        }
    }
}

export class RadarChart extends BaseChart {
    defaultOptions = {
        type: "radar",
        options: {
            animation: false,
            plugins: {
                legend: {
                    display: false,
                    position: "bottom",
                },
            },
            elements: {
                point: {
                    pointHitRadius: 4,

                }
            },
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    min: 0,
                    max: 1,
                    ticks: {
                        display: false,
                        maxTicksLimit: 2,
                    },
                },
            }
        }
    }

    makeChartConfig(data: ChartData<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint | null)[], unknown>): ChartConfiguration<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint | [number, number] | null)[], unknown> {
        return {...this.defaultOptions, data: data} as ChartConfiguration
    }
}

export class BarChart extends BaseChart {
    defaultOptions = {
        type: "bar",
        options: {
            animation: false,
            plugins: {
                legend: {
                display: false,
                },
            },
            responsive: true,
            maintainAspectRatio: false,
        },
    }

    makeChartConfig(data: ChartData<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint | null)[], unknown>): ChartConfiguration<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint | [number, number] | null)[], unknown> {
        return {...this.defaultOptions, data: data} as ChartConfiguration
    }
}