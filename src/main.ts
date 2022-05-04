import { Chart, registerables } from "chart.js";
import { MetricLabel } from "./metrics";
import "./style.css";
import { Target } from "./target";
import { DamageType, Weapon, WeaponType } from "./weapon";
import { hasBonus, generateMetrics, normalize, WeaponStats } from "./stats";
import { AnyObject } from "chart.js/types/basic";

import POLEHAMMER from "./weapons/polehammer.json";
import MESSER from "./weapons/messer.json";
import MAUL from "./weapons/maul.json";
import DANE_AXE from "./weapons/dane_axe.json";
import FALCHION from "./weapons/falchion.json";
import GREATSWORD from "./weapons/greatsword.json";
import HIGHLAND_SWORD from "./weapons/highland_sword.json";
import KNIFE from "./weapons/knife.json";
import LONGSWORD from "./weapons/longsword.json";
import RAPIER from "./weapons/rapier.json";
import SWORD from "./weapons/sword.json";


Chart.register(...registerables) // the auto import stuff was making typescript angry.

function weaponFromJson(obj: AnyObject): Weapon {
  return Object.setPrototypeOf(obj, Weapon.prototype);
}

let ALL_WEAPONS: Weapon[] = [
  weaponFromJson(POLEHAMMER),
  weaponFromJson(MESSER),
  weaponFromJson(MAUL),
  weaponFromJson(DANE_AXE),
  weaponFromJson(FALCHION),
  weaponFromJson(GREATSWORD),
  weaponFromJson(HIGHLAND_SWORD),
  weaponFromJson(KNIFE),
  weaponFromJson(LONGSWORD),
  weaponFromJson(RAPIER),
  weaponFromJson(SWORD),
]

let STATS: WeaponStats = generateMetrics(ALL_WEAPONS);
let NORMALIZED_STATS: WeaponStats = normalize(STATS);

console.log(NORMALIZED_STATS);

let selectedTarget = Target.VANGUARD_ARCHER;

let selectedWeapons = new Set<Weapon>(ALL_WEAPONS.slice(0,3))

let selectedCategories = new Set<MetricLabel>([
  MetricLabel.RANGE_AVERAGE,
  MetricLabel.WINDUP_AVERAGE,
  MetricLabel.DAMAGE_AVERAGE,
]);

const OPACITY = 0.7;

function weaponColor(weapon: Weapon) {
  const idx = ALL_WEAPONS.indexOf(weapon);
  const totalWeapons = ALL_WEAPONS.length;
  return `hsl(${(idx / totalWeapons) * 360}deg, 100%, 50%, ${OPACITY})`;
}


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
    /*scales: {
      radial: {
        min: 0,
        max: 1,
      },
    },*/
  },
  data: chartData(NORMALIZED_STATS),
});

function redraw() {
  chart.data = chartData(NORMALIZED_STATS);
  chart.update();
}

function setWeapon(weapon: Weapon, enabled: boolean) {
  if (enabled) {
    selectedWeapons.add(weapon);
  } else {
    selectedWeapons.delete(weapon);
  }
  redraw();
}

// Write all weapons we know about into the weapons list
const weapons = document.getElementById("weapons") as HTMLFieldSetElement;
ALL_WEAPONS.map((w) => {
  const div = document.createElement("div");
  div.style.display = "flex";
  div.style.alignItems = "center";

  const swatch = document.createElement("div");
  swatch.style.width = "15px";
  swatch.style.background = weaponColor(w);
  swatch.style.aspectRatio = "1";
  div.appendChild(swatch);

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
(document.getElementById("vanguard_archer") as HTMLInputElement).onclick =
  () => {
    selectedTarget = Target.VANGUARD_ARCHER;
    redraw();
  };

(document.getElementById("footman") as HTMLInputElement).onclick = () => {
  selectedTarget = Target.FOOTMAN;
  redraw();
};

(document.getElementById("knight") as HTMLInputElement).onclick = () => {
  selectedTarget = Target.KNIGHT;
  redraw();
};
