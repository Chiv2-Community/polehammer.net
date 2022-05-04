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
let selectedCategories = new Set<Rating>();

const SATURATION = "85%";
const LIGHTNESS = "45%";
const OPACITY = 0.6;

// Repeat the palette three times:
// Once solid, then once dashed, then once dotted
// const PALETTE_SIZE = Math.ceil(Object.values(Weapon).length / 3);
const PALETTE_SIZE = 16;
const PALETTE_DEGS = [...Array(PALETTE_SIZE)].map((_, idx) => {
  // Cycle through large shifts in the 360deg colour wheel
  // This changes the colour more from one index to another
  // so we don't get "three shades of green" all in a row
  return (idx * 360) / PALETTE_SIZE + (idx % 2) * 180;
});

function weaponColor(weapon: Weapon) {
  const idx = ALL_WEAPONS.indexOf(weapon);
  return `hsl(${
    PALETTE_DEGS[idx % PALETTE_DEGS.length]
  }deg, ${SATURATION}, ${LIGHTNESS}, ${OPACITY})`;
}

function weaponDash(weapon: Weapon) {
  const idx = ALL_WEAPONS.indexOf(weapon);
  if (idx >= 2 * PALETTE_SIZE) {
    return "dotted";
  } else if (idx >= PALETTE_SIZE) {
    return "dashed";
  } else {
    return "solid";
  }
}

function borderDash(weapon: Weapon) {
  switch (weaponDash(weapon)) {
    case "solid":
      return undefined;
    case "dashed":
      return [8, 8];
    case "dotted":
      return [2, 2];
  }
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
    /*scales: {
      radial: {
        min: 0,
        max: 1,
        ticks: {
          display: false,
          maxTicksLimit: 2,
        },
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
  const checkbox = document.getElementById(weapon) as HTMLInputElement;
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
  ALL_WEAPONS.map(w => {
    const checkbox = document.getElementById(w.name) as HTMLInputElement;
    checkbox.checked = false;
    const label = checkbox.nextSibling as HTMLLabelElement;
    label.style.border = `3px solid transparent`;
  });
}

// Choose 3 random weapons
function random() {
  clear();
  const random = shuffle(Object.values(Weapon));
  random.slice(0, 3).map((w) => setWeapon(w, true));
}

// Reset to default category selections
// Clear all weapon selections
function reset() {
  selectedCategories.clear();
  selectedCategories.add(Rating.SPEED_AVERAGE);
  selectedCategories.add(Rating.RANGE_AVERAGE);
  selectedCategories.add(Rating.DAMAGE_AVERAGE);
  redraw();
  Object.values(Rating).map((r) => {
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
