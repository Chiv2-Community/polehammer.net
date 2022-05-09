import { Chart, ChartData, registerables } from "chart.js";
import ALL_WEAPONS, { weaponByName } from "./all_weapons";
import { MetricLabel, Unit } from "./metrics";
import {
  generateMetrics,
  hasBonus,
  unitGroupStats,
  UnitStats,
  WeaponStats,
} from "./stats";
import "./style.css";
import { Target } from "./target";
import { borderDash, weaponColor, weaponDash } from "./ui";
import { shuffle } from "./util";
import { bonusMult, Weapon } from "./weapon";

Chart.register(...registerables); // the auto import stuff was making typescript angry.

const STATS: WeaponStats = generateMetrics(ALL_WEAPONS);
const UNIT_STATS: UnitStats = unitGroupStats(STATS);

let selectedTarget = Target.VANGUARD_ARCHER;
const selectedWeapons: Set<Weapon> = new Set<Weapon>();
const selectedCategories: Set<MetricLabel> = new Set<MetricLabel>();

function chartData(dataset: WeaponStats, categories: Set<MetricLabel>, normalizationStats: UnitStats, setBgColor: boolean): ChartData {
  return {
    labels: [...categories],
    datasets: [...selectedWeapons].map((w) => {
      return {
        label: w.name,
        data: [...categories].map((c) => {
          const metric = dataset.get(w)!.get(c)!;
          let value = metric.value;
          if (hasBonus(c)) {
            value *= bonusMult(selectedTarget, w.damageType);
          }
          
          let maybeUnitStats = normalizationStats.get(metric.unit);
          if(maybeUnitStats) {
            const unitMin = maybeUnitStats!.min;
            const unitMax = maybeUnitStats!.max;

            // Normalize
            return (value - unitMin) / (unitMax - unitMin);
          }
          return value;
        }),
        backgroundColor: setBgColor ? weaponColor(w) : "transparent",
        borderColor: weaponColor(w),
        borderDash: borderDash(w),
      };
    }),
  };
}

const radar: Chart = new Chart(document.getElementById("radar") as HTMLCanvasElement, {
  type: "radar",
  options: {
    animation: false,
    plugins: {
      legend: {
        display: true,
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
  data: chartData(STATS, selectedCategories, UNIT_STATS, false),
});


const bars: Array<Chart> = Array()

function createBarChart(element: HTMLCanvasElement, category: MetricLabel) {
  let stats: UnitStats = new Map()
  stats.set(Unit.SPEED, UNIT_STATS.get(Unit.SPEED)!);

  return new Chart(element as HTMLCanvasElement, {
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
    data: chartData(STATS, new Set([category]), stats, true),
  });
}

function redrawBars() {
  let barsElem = document.getElementById("bars")!;
  bars.forEach(b => b.destroy());
  while(barsElem.firstChild) {
    barsElem.removeChild(barsElem.firstChild);
  }

  bars.splice(0, bars.length);

  selectedCategories.forEach(c => {
      let outer = document.createElement("div");
      outer.className = "col-md-6";
      outer.id = c;
      let elem = document.createElement("canvas");
      outer.appendChild(elem);
      barsElem.appendChild(outer);
      bars.push(createBarChart(elem, c));
  });
}

function redraw() {
  radar.data = chartData(STATS, selectedCategories, UNIT_STATS, false);
  radar.update();

  redrawBars();

  // Update content of location string so we can share
  const params = new URLSearchParams();
  params.set("target", selectedTarget);
  [...selectedWeapons].map((w) => params.append("weapon", w.name));
  [...selectedCategories].map((c) => params.append("category", c));
  window.history.replaceState(null, "", `?${params.toString()}`);
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
ALL_WEAPONS.forEach((w) => {
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
  label.style.border = `3px solid transparent`;
  div.appendChild(label);

  weapons.appendChild(div);
});

function setCategory(category: MetricLabel, enabled: boolean) {
  const checkbox = document.getElementById(category) as HTMLInputElement;
  checkbox.checked = enabled;

  if (enabled) {
    selectedCategories.add(category);
  } else {
    selectedCategories.delete(category);
  }
  redraw();
}

// Write all categories we know about into the categories list
const categories = document.getElementById("categories") as HTMLFieldSetElement;
Object.values(MetricLabel).forEach((r) => {
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
  random.slice(0, 3).forEach((w) => setWeapon(w, true));
}

// Reset to default category selections
// Clear all weapon selections
function reset() {
  selectedCategories.clear();
  selectedCategories.add(MetricLabel.SPEED_AVERAGE);
  selectedCategories.add(MetricLabel.RANGE_AVERAGE);
  selectedCategories.add(MetricLabel.DAMAGE_AVERAGE);
  Object.values(MetricLabel).map((r) => {
    const checkbox = document.getElementById(r) as HTMLInputElement;
    checkbox.checked = selectedCategories.has(r);
  });
  redraw();
}

// Link up to buttons
document.getElementById("random")!.onclick = random;
document.getElementById("clear")!.onclick = clear;
document.getElementById("reset")!.onclick = reset;

// Link up Share button
document.getElementById("share")!.onclick = () => {
  navigator.clipboard.writeText(window.location.toString());
  alert("Copied to clipboard!");
};

// Use query string to init values if possible
const params = new URLSearchParams(location.search);
if (params.get("target")) {
  selectedTarget = params.get("target") as Target;
}

if (params.getAll("weapon").length) {
  params.getAll("weapon").map((name) => {
    const weapon = weaponByName(name);
    if (weapon) setWeapon(weapon, true);
  });
} else {
  random();
}

if (params.getAll("category").length) {
  params.getAll("category").map((c) => setCategory(c as MetricLabel, true));
} else {
  reset();
}

// Link up target radio buttons
Object.values(Target).forEach((t) => {
  const radio = document.getElementById(t) as HTMLInputElement;
  radio.onclick = () => {
    selectedTarget = t;
    redraw();
  };
  radio.checked = selectedTarget === t;
});
