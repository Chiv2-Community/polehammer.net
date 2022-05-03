import Chart from "chart.js/auto";
import { Rating } from "./rating";
import "./style.css";
import { Weapon } from "./weapon";
import { NORMALIZED_RATINGS } from "./weapon";

let selectedWeapons = new Set<Weapon>([
  Weapon.LONGSWORD,
  Weapon.POLEHAMMER,
  Weapon.RAPIER,
]);
let selectedCategories = new Set<Rating>([
  Rating.RANGE_AVERAGE,
  Rating.SPEED_AVERAGE,
  Rating.DAMAGE_AVERAGE,
]);

const OPACITY = 0.7;

function weaponColor(weapon: Weapon) {
  const idx = Object.values(Weapon).indexOf(weapon);
  const totalWeapons = Object.values(Weapon).length;
  return `hsl(${(idx / totalWeapons) * 360}deg, 100%, 50%, ${OPACITY})`;
}

function chartData() {
  return {
    labels: [...selectedCategories],
    datasets: [...selectedWeapons].map((w) => {
      return {
        label: w,
        data: [...selectedCategories].map(
          (c) => NORMALIZED_RATINGS.get(w)!.get(c)!
        ),
        backgroundColor: "transparent",
        borderColor: weaponColor(w),
      };
    }),
  };
}

const chart = new Chart(document.getElementById("chart") as HTMLCanvasElement, {
  type: "radar",
  options: {
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  },
  data: chartData(),
});

function setWeapon(weapon: Weapon, enabled: boolean) {
  if (enabled) {
    selectedWeapons.add(weapon);
  } else {
    selectedWeapons.delete(weapon);
  }
  chart.data = chartData();
  chart.update();
}

// Write all weapons we know about into the weapons list
const weapons = document.getElementById("weapons") as HTMLFieldSetElement;
Object.values(Weapon).map((w) => {
  const div = document.createElement("div");
  div.style.display = "flex";
  div.style.alignItems = "center";

  const swatch = document.createElement("div");
  swatch.style.width = "15px";
  swatch.style.background = weaponColor(w);
  swatch.style.aspectRatio = "1";
  div.appendChild(swatch);

  const input = document.createElement("input");
  input.id = w;
  input.checked = selectedWeapons.has(w);
  input.setAttribute("type", "checkbox");
  input.onclick = (ev) => {
    const enabled = (ev.target as HTMLInputElement).checked;
    setWeapon(w, enabled);
  };
  div.appendChild(input);

  const label = document.createElement("label");
  label.htmlFor = w;
  label.innerText = w;
  div.appendChild(label);

  weapons.appendChild(div);
});

function setCategory(category: Rating, enabled: boolean) {
  if (enabled) {
    selectedCategories.add(category);
  } else {
    selectedCategories.delete(category);
  }
  chart.data = chartData();
  chart.update();
}

// Write all categories we know about into the categories list
const categories = document.getElementById("categories") as HTMLFieldSetElement;
Object.values(Rating).map((r) => {
  const div = document.createElement("div");

  const input = document.createElement("input");
  input.id = r;
  input.checked = selectedCategories.has(r);
  input.setAttribute("type", "checkbox");
  input.onclick = (ev) => {
    const enabled = (ev.target as HTMLInputElement).checked;
    setCategory(r, enabled);
  };
  div.appendChild(input);

  const label = document.createElement("label");
  label.htmlFor = r;
  label.innerText = r;
  div.appendChild(label);

  categories.appendChild(div);
});
