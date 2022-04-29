import Chart, { ChartDataset } from "chart.js/auto";
import { Metric } from "./rating";
import "./style.css";
import { Weapon } from "./weapon";
import { Ratings } from "./weapon";

let selectedWeapons = [Weapon.RAPIER, Weapon.LONGSWORD];

const datasets: ChartDataset<"radar">[] = selectedWeapons.map((w) => {
  return {
    label: w,
    data: [...Ratings.get(w)!.values()],
  };
});

const chart = new Chart(document.getElementById("chart") as HTMLCanvasElement, {
  type: "radar",
  options: {},
  data: { labels: Object.values(Metric), datasets },
});

chart.update();
