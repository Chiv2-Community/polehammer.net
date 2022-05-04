import { Chart, registerables } from "chart.js";
import { MetricLabel } from "./metrics";
import "./style.css";
import { Target } from "./target";
import { Weapon } from "./weapon";
import { hasBonus, generateMetrics, normalize, WeaponStats } from "./stats";
import { AnyObject } from "chart.js/types/basic";

import AXE from "./weapons/axe.json";
import BATTLE_AXE from "./weapons/battle_axe.json";
import CUDGEL from "./weapons/cudgel.json";
import DAGGER from "./weapons/dagger.json";
import DANE_AXE from "./weapons/dane_axe.json";
import EXECUTIONERS_AXE from "./weapons/executioners_axe.json";
import FALCHION from "./weapons/falchion.json";
import GLAIVE from "./weapons/glaive.json";
import GREATSWORD from "./weapons/greatsword.json";
import HALBERD from "./weapons/halberd.json";
import HATCHET from "./weapons/hatchet.json";
import HEAVY_MACE from "./weapons/heavy_mace.json";
import HIGHLAND_SWORD from "./weapons/highland_sword.json";
import JAVELIN from "./weapons/javelin.json";
import KNIFE from "./weapons/knife.json";
import LONGSWORD from "./weapons/longsword.json";
import MACE from "./weapons/mace.json";
import MALLET from "./weapons/mallet.json";
import MAUL from "./weapons/maul.json";
import MESSER from "./weapons/messer.json";
import MORNING_STAR from "./weapons/morning_star.json";
import ONE_HANDED_SPEAR from "./weapons/one_handed_spear.json";
import PICKAXE from "./weapons/pickaxe.json";
import POLEAXE from "./weapons/poleaxe.json";
import POLEHAMMER from "./weapons/polehammer.json";
import RAPIER from "./weapons/rapier.json";
import SHORT_SWORD from "./weapons/short_sword.json";
import SHOVEL from "./weapons/shovel.json";
import SLEDGEHAMMER from "./weapons/sledgehammer.json";
import SWORD from "./weapons/sword.json";
import THROWING_AXE from "./weapons/throwing_axe.json";
import TWO_HANDED_HAMMER from "./weapons/two_handed_hammer.json";
import TWO_HANDED_SPEAR from "./weapons/two_handed_spear.json";
import WAR_AXE from "./weapons/war_axe.json";
import WAR_CLUB from "./weapons/war_club.json";
import WARHAMMER from "./weapons/warhammer.json";



Chart.register(...registerables) // the auto import stuff was making typescript angry.

function weaponFromJson(obj: AnyObject): Weapon {
  return Object.setPrototypeOf(obj, Weapon.prototype);
}

let ALL_WEAPONS: Weapon[] = [
  weaponFromJson(AXE),
  weaponFromJson(BATTLE_AXE),
  weaponFromJson(CUDGEL),
  weaponFromJson(DAGGER),
  weaponFromJson(DANE_AXE),
  weaponFromJson(EXECUTIONERS_AXE),
  weaponFromJson(FALCHION),
  weaponFromJson(GLAIVE),
  weaponFromJson(GREATSWORD),
  weaponFromJson(HALBERD),
  weaponFromJson(HATCHET),
  weaponFromJson(HEAVY_MACE),
  weaponFromJson(HIGHLAND_SWORD),
  weaponFromJson(JAVELIN),
  weaponFromJson(KNIFE),
  weaponFromJson(LONGSWORD),
  weaponFromJson(MACE),
  weaponFromJson(MALLET),
  weaponFromJson(MAUL),
  weaponFromJson(MESSER),
  weaponFromJson(MORNING_STAR),
  weaponFromJson(ONE_HANDED_SPEAR),
  weaponFromJson(PICKAXE),
  weaponFromJson(POLEAXE),
  weaponFromJson(POLEHAMMER),
  weaponFromJson(RAPIER),
  weaponFromJson(SHORT_SWORD),
  weaponFromJson(SHOVEL),
  weaponFromJson(SLEDGEHAMMER),
  weaponFromJson(SWORD),
  weaponFromJson(THROWING_AXE),
  weaponFromJson(TWO_HANDED_HAMMER),
  weaponFromJson(TWO_HANDED_SPEAR),
  weaponFromJson(WAR_AXE),
  weaponFromJson(WAR_CLUB),
  weaponFromJson(WARHAMMER)
]

let WEAPONS_BY_NAME: Map<string, Weapon> = new Map(ALL_WEAPONS.map(x => [x.name, x]))

let STATS: WeaponStats = generateMetrics(ALL_WEAPONS);
let NORMALIZED_STATS: WeaponStats = normalize(STATS);

let selectedTarget = Target.VANGUARD_ARCHER;

let selectedWeapons = new Set<Weapon>([
  WEAPONS_BY_NAME.get("Polehammer")!, 
  WEAPONS_BY_NAME.get("Dane Axe")!, 
  WEAPONS_BY_NAME.get("Messer")!
]);

let selectedCategories = new Set<MetricLabel>();

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
ALL_WEAPONS.map(w => {
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
  ALL_WEAPONS.map(w => {
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
  selectedCategories.add(MetricLabel.WINDUP_AVERAGE);
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
