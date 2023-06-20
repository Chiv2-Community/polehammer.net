import { BubbleDataPoint, Chart, ChartConfiguration, ChartData, ChartTypeRegistry, ScatterDataPoint } from "chart.js";

export abstract class BaseChart {
    chartElement: HTMLCanvasElement;
    chart: Chart | undefined;
    
    abstract makeChartConfig(data: ChartData): ChartConfiguration

    constructor(elementId: string) {
        let maybeChartElement = document.querySelector<HTMLCanvasElement>(elementId);
        if (!maybeChartElement) {
            throw new Error("Invalid selector provided: " + elementId);
        }
        this.chartElement = maybeChartElement!;
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
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                radial: {
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
    makeChartConfig(data: ChartData<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint | null)[], unknown>): ChartConfiguration<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint | null)[], unknown> {
        return {...this.defaultOptions, data: data} as ChartConfiguration
    }
}
  /*
    private createBarChart(element: HTMLCanvasElement, category: MetricLabel): Chart {
      const barUnitStats: UnitStats = new Map();
      if(category.includes("Speed")) {
        barUnitStats.set(category, this.unitStats.get(category)!);
      }
  
      return new Chart(element as HTMLCanvasElement, {
        type: "bar",
        // ... other options ...
        data: this.chartData(this.stats, new Set([category]), barUnitStats, true),
      });
    }
  
    redrawBars(elementId: string): void {
      const barsElem = document.getElementById(elementId)!;
      this.bars.forEach((b) => b.destroy());
      while (barsElem.firstChild) {
        barsElem.removeChild(barsElem.firstChild);
      }
  
      this.bars.splice(0, this.bars.length);
  
      this.categorySelector.selectedItems.forEach((c) => {
        const outer = document.createElement("div");
        outer.className = "col-md-4";
        outer.id = c + "-bar";
        const elem = document.createElement("canvas");
        outer.appendChild(elem);
        barsElem.appendChild(outer);
        this.bars.push(this.createBarChart(elem, c));
      });
    }
    */
  