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

// Write all weapons we know about into the weapons list
const weapons = document.getElementById("weapons") as HTMLFieldSetElement;
Object.values(Weapon).map((w) => {
  const div = document.createElement("div");

  const input = document.createElement("input");
  input.id = w;
  input.checked = selectedWeapons.includes(w);
  input.setAttribute("type", "checkbox");
  div.appendChild(input);

  const label = document.createElement("label");
  label.htmlFor = w;
  label.innerText = w;
  div.appendChild(label);

  weapons.appendChild(div);
});

// Write all categories we know about into the categories list
const categories = document.getElementById("categories") as HTMLFieldSetElement;
Object.values(Rating).map((r) => {
  const div = document.createElement("div");

  const input = document.createElement("input");
  input.id = r;
  input.checked = selectedCategories.includes(r);
  input.setAttribute("type", "checkbox");
  div.appendChild(input);

  const label = document.createElement("label");
  label.htmlFor = r;
  label.innerText = r;
  div.appendChild(label);

  categories.appendChild(div);
});

chart.update();
