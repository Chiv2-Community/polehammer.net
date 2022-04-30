import Chart, { ChartDataset } from "chart.js/auto";
import { Rating } from "./rating";
import "./style.css";
import { Weapon } from "./weapon";
import { NORMALIZED_RATINGS } from "./weapon";

let selectedWeapons = [Weapon.RAPIER, Weapon.LONGSWORD];

const datasets: ChartDataset<"radar">[] = selectedWeapons.map((w) => {
  return {
    label: w,
    data: [...NORMALIZED_RATINGS.get(w)!.values()],
  };
});

const chart = new Chart(document.getElementById("chart") as HTMLCanvasElement, {
  type: "radar",
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
  data: { labels: Object.values(Rating), datasets },
});

chart.update();
