import Chart, { ChartDataset } from "chart.js/auto";
import { Rating } from "./rating";
import "./style.css";
import { Weapon } from "./weapon";
import { NORMALIZED_RATINGS } from "./weapon";

let selectedWeapons = [Weapon.RAPIER, Weapon.LONGSWORD];
let selectedCategories = [
  Rating.RANGE_AVERAGE,
  Rating.SPEED_AVERAGE,
  Rating.DAMAGE_AVERAGE,
];

const OPACITY = 0.7;

const datasets: ChartDataset<"radar">[] = selectedWeapons.map((w, idx) => {
  return {
    label: w,
    data: selectedCategories.map((c) => NORMALIZED_RATINGS.get(w)!.get(c)!),
    backgroundColor: "transparent",
    borderColor: `hsl(${
      (idx / selectedWeapons.length) * 360
    }deg, 100%, 50%, ${OPACITY})`,
  };
});

const chart = new Chart(document.getElementById("chart") as HTMLCanvasElement, {
  type: "radar",
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
  data: { labels: selectedCategories, datasets },
});

chart.update();
