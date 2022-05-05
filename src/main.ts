import { Chart, registerables } from "chart.js";
import ALL_WEAPONS from "./all_weapons";
import { MetricLabel } from "./metrics";
import { generateMetrics, hasBonus, normalize, WeaponStats } from "./stats";
import "./style.css";
import { Target } from "./target";
import { borderDash, weaponColor, weaponDash } from "./ui";
import { Weapon } from "./weapon";

Chart.register(...registerables); // the auto import stuff was making typescript angry.

let WEAPONS_BY_NAME: Map<string, Weapon> = new Map(
  ALL_WEAPONS.map((x) => [x.name, x])
);

let STATS: WeaponStats = generateMetrics(ALL_WEAPONS);
let NORMALIZED_STATS: WeaponStats = normalize(STATS);

let selectedTarget = Target.VANGUARD_ARCHER;

let selectedWeapons = new Set<Weapon>([
  WEAPONS_BY_NAME.get("Polehammer")!,
  WEAPONS_BY_NAME.get("Dane Axe")!,
  WEAPONS_BY_NAME.get("Messer")!,
]);

let selectedCategories = new Set<MetricLabel>();

function chartData(dataset: WeaponStats) {
  return {
    labels: [...selectedCategories],
    datasets: [...selectedWeapons].map((w) => {
      return {
        label: w.name,
        data: [...selectedCategories].map((c) => {
          const baseMetricLabel = dataset.get(w)!.get(c)!;
          if (hasBonus(c)) {
            return w.bonusMult(selectedTarget) * baseMetricLabel;
          } else {
            return baseMetricLabel;
          }
        }),
        backgroundColor: "transparent",
        borderColor: weaponColor(w),
        borderDash: borderDash(w),
      };
    }),
  };
}

const chart = new Chart(document.getElementById("chart") as HTMLCanvasElement, {
  type: "radar",
  options: {
    animation: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      radial: {
        min: 0,
        max: 1,
        ticks: {
          display: false,
          maxTicksLimit: 2,
        },
      },
    },
  },
  data: chartData(NORMALIZED_STATS),
});

function redraw() {
  chart.data = chartData(NORMALIZED_STATS);
  chart.update();
}

function setWeapon(weapon: Weapon, enabled: boolean) {
  const checkbox = document.getElementById(weapon.name) as HTMLInputElement;
  checkbox.checked = enabled;

  if (enabled) {
    selectedWeapons.add(weapon);
    const label = checkbox.nextSibling as HTMLLabelElement;
    label.style.border = `3px ${weaponDash(weapon)} ${weaponColor(weapon)}`;
  } else {
    selectedWeapons.delete(weapon);
    const label = checkbox.nextSibling as HTMLLabelElement;
    label.style.border = `3px solid transparent`;
  }
  redraw();
}

// Write all weapons we know about into the weapons list
const weapons = document.getElementById("weapons") as HTMLFieldSetElement;
ALL_WEAPONS.map((w) => {
  const div = document.createElement("div");
  div.style.display = "flex";
  div.style.alignItems = "center";

  const input = document.createElement("input");
  input.id = w.name;
  input.checked = selectedWeapons.has(w);
  input.setAttribute("type", "checkbox");
  input.onclick = (ev) => {
    const enabled = (ev.target as HTMLInputElement).checked;
    setWeapon(w, enabled);
  };
  div.appendChild(input);

  const label = document.createElement("label");
  label.htmlFor = w.name;
  label.innerText = w.name;
  label.style.padding = "0.2em";
  div.appendChild(label);

  weapons.appendChild(div);
});

function setCategory(category: MetricLabel, enabled: boolean) {
  if (enabled) {
    selectedCategories.add(category);
  } else {
    selectedCategories.delete(category);
  }
  redraw();
}

// Write all categories we know about into the categories list
const categories = document.getElementById("categories") as HTMLFieldSetElement;
Object.values(MetricLabel).map((r) => {
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

// Link up target radio buttons
Object.values(Target).map((t) => {
  const radio = document.getElementById(t) as HTMLInputElement;
  radio.onclick = () => {
    selectedTarget = t;
    redraw();
  };
});

function shuffle<T>(arr: T[]) {
  const newArr = arr.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr;
}

// Clear all weapon selections
function clear() {
  selectedWeapons.clear();
  redraw();
  updateWeaponCheckboxes();
}

function updateWeaponCheckboxes() {
  ALL_WEAPONS.map((w) => {
    const checkbox = document.getElementById(w.name) as HTMLInputElement;
    checkbox.checked = Array.from(selectedWeapons).includes(w);
    const label = checkbox.nextSibling as HTMLLabelElement;
    label.style.border = `3px solid transparent`;
  });
}

// Choose 3 random weapons
function random() {
  clear();
  const random = shuffle(ALL_WEAPONS);
  random.slice(0, 3).map((w) => setWeapon(w, true));
}

// Reset to default category selections
// Clear all weapon selections
function reset() {
  selectedCategories.clear();
  selectedCategories.add(MetricLabel.SPEED_AVERAGE);
  selectedCategories.add(MetricLabel.RANGE_AVERAGE);
  selectedCategories.add(MetricLabel.DAMAGE_AVERAGE);
  redraw();
  Object.values(MetricLabel).map((r) => {
    const checkbox = document.getElementById(r) as HTMLInputElement;
    checkbox.checked = selectedCategories.has(r);
  });
}

// Link up to buttons
document.getElementById("random")!.onclick = random;
document.getElementById("clear")!.onclick = clear;
document.getElementById("reset")!.onclick = reset;

random();
reset();
