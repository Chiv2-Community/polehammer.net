import { Chart, ChartData, registerables } from "chart.js";
import ALL_WEAPONS, { weaponByName, weaponById } from "./all_weapons";
import { MetricLabel, MetricResult } from "./metrics";
import {
  generateMetrics,
  unitGroupStats,
  UnitStats,
  WeaponStats,
} from "./stats";
import "./style.scss";
import { Target } from "./target";
import { borderDash, metricColor, weaponColor, weaponDash } from "./ui";
import { shuffle } from "./util";
import { Weapon } from "./weapon";
import { SearchSelector } from "./components/search_selector";
import CATEGORY_PRESETS from "./components/category_presets";
import WEAPON_PRESETS from "./components/weapon_presets";
import { Table } from "./components/table";
import { InputHandler } from "./components/input_slider";
import { RadarChart } from "./components/chart";

Chart.defaults.font.family = "'Lato', sans-serif";
Chart.register(...registerables); // the auto import stuff was making typescript angry.

let selectedTarget = Target.AVERAGE;
let numberOfTargets = 1;
let horsebackDamageMultiplier = 1.0;

let stats: WeaponStats = generateMetrics(ALL_WEAPONS, 1, 1, Target.VANGUARD_ARCHER);
let unitStats: UnitStats = unitGroupStats(stats);

let selectedTab = "radar-content-tab";

let weaponBorderStyle = (weapon: Weapon, label: HTMLLabelElement) => {
  label.style.border = `3px ${weaponDash(weapon)} ${weaponColor(weapon, 0.6)}`;
  return label
}

const weaponSelector = new SearchSelector<Weapon>(
  new Set(ALL_WEAPONS), 
  "#weaponSearch", 
  "#weaponSearchResults", 
  "#displayedWeapons", 
  WEAPON_PRESETS,
  "#presetsSelectWeapon",
  w => w.name, 
  weaponBorderStyle, 
  redraw
);

const categorySelector = new SearchSelector<MetricLabel>(
  new Set(Object.values(MetricLabel)),
  "#categorySearch",
  "#categorySearchResults",
  "#displayedCategories",
  CATEGORY_PRESETS,
  "#presetsSelectCategory",
  c => c,
  (_, label) => label,
  redraw
)

const table = new Table(
  "#statTable", 
  (header, cellData) => {
    cellData = cellData as MetricResult;
    let range = unitStats.get(header)!;
    let cellContent: string = Math.round(cellData.rawResult).toString();
    let cell = document.createElement("td");
    cell.innerHTML = cellContent;
    cell.className = "border";
    cell.style.backgroundColor = metricColor(cellData.result, range);
    return cell;
  }
)

function weaponsToRows(weapons: Set<Weapon>): Array<Array<string | MetricResult>> {
  return Array.from(weapons).map((w) => {
    return [
      w.name,
      ...Array.from(categorySelector.selectedItems).map((c) => {
        const metric = stats.get(w.name)!.get(c)!;
        return metric.value
      }),
    ];
  });
}

function toId(str: string) {
  return str
    .replaceAll(" ", "_")
    .replaceAll("/", "-")
    .replaceAll("(", ":")
    .replaceAll(")", ":");
}

// Normalization will only occur for stat types that have a unit present in the provided normalizationStats.
// This allows for selective normalization, like for bar charts where we want mostly raw data, except for
// "speed" (or other inverse metrics) which only make sense as a normalized value
function chartData(
  dataset: WeaponStats,
  categories: Set<MetricLabel>,
  normalizationStats: UnitStats,
  setBgColor: boolean
): ChartData {

  let sortedCategories = Array.from(categories);
  sortedCategories.sort((a,b) => {
    return Object.values(MetricLabel).indexOf(a) - Object.values(MetricLabel).indexOf(b);
  });

  return {
    labels: [...sortedCategories],
    datasets: [...weaponSelector.selectedItems].map((w) => {
      return {
        label: w.name,
        data: [...sortedCategories].map((c) => {
          const metric = dataset.get(w.name)!.get(c)!;
          let value = metric.value.result;
          const maybeUnitStats = normalizationStats.get(c);
          if (maybeUnitStats) {
            const unitMin = maybeUnitStats!.min;
            const unitMax = maybeUnitStats!.max;

            // Normalize
            return (value - unitMin) / (unitMax - unitMin);
          }
          return value;
        }),
        backgroundColor: setBgColor ? weaponColor(w, 0.6) : weaponColor(w, 0.1),
        borderColor: weaponColor(w, 0.6),
        borderDash: borderDash(w),
      };
    }),
  };
}

const radar: RadarChart = new RadarChart("#radar");

const bars = new Array<Chart>();

function createBarChart(element: HTMLCanvasElement, category: MetricLabel) {
  const barUnitStats: UnitStats = new Map();
  if(category.includes("Speed")) {
    barUnitStats.set(category, unitStats.get(category)!);
  }

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
    data: chartData(stats, new Set([category]), barUnitStats, true),
  });
}

function redrawBars() {
  const barsElem = document.getElementById("bars")!;
  bars.forEach((b) => b.destroy());
  while (barsElem.firstChild) {
    barsElem.removeChild(barsElem.firstChild);
  }

  bars.splice(0, bars.length);

  categorySelector.selectedItems.forEach((c) => {
    const outer = document.createElement("div");
    outer.className = "col-md-4";
    outer.id = c + "-bar";
    const elem = document.createElement("canvas");
    outer.appendChild(elem);
    barsElem.appendChild(outer);
    bars.push(createBarChart(elem, c));
  });
}

function redrawTable() {
  table.setHeaders(Array.from(categorySelector.selectedItems));
  table.draw(weaponsToRows(weaponSelector.selectedItems));
}

function redraw() {
  stats = generateMetrics(ALL_WEAPONS, numberOfTargets, horsebackDamageMultiplier, selectedTarget)
  unitStats = unitGroupStats(stats);

  radar.render(chartData(stats, categorySelector.selectedItems, unitStats, false));

  redrawBars();
  redrawTable();
  updateUrlParams();
}


function updateUrlParams() {
  const params = new URLSearchParams();
  params.set("target", selectedTarget);
  params.set("numberOfTargets", numberOfTargets.toString());
  params.set("tab", selectedTab);
  params.append("weapon", [...weaponSelector.selectedItems].map(x => x.id).join("-"));
  [...categorySelector.selectedItems].map((c) => params.append("category", c));
  window.history.replaceState(null, "", `?${params.toString()}`);
}

// Choose 3 random weapons
function random() {
  weaponSelector.clearSelection();
  const random = shuffle(ALL_WEAPONS.filter(x => x.name != "Polehammer"));
  weaponSelector.addSelected(weaponById("ph")!)
  random.slice(0, 2).forEach(w => weaponSelector.addSelected(w));
}

// Reset to default category selections
// Clear all weapon selections
function reset() {
  categorySelector.clearSelection();
  [
    MetricLabel.RANGE_AVERAGE, 
    MetricLabel.RANGE_ALT_AVERAGE, 
    MetricLabel.WINDUP_HEAVY_AVERAGE, 
    MetricLabel.RELEASE_HEAVY_AVERAGE, 
    MetricLabel.RECOVERY_HEAVY_AVERAGE,
    MetricLabel.COMBO_HEAVY_AVERAGE,
    MetricLabel.DAMAGE_HEAVY_AVERAGE,
    MetricLabel.WINDUP_LIGHT_AVERAGE,
    MetricLabel.RELEASE_LIGHT_AVERAGE,
    MetricLabel.RECOVERY_LIGHT_AVERAGE,
    MetricLabel.COMBO_LIGHT_AVERAGE,
    MetricLabel.DAMAGE_LIGHT_AVERAGE,
  ].map(l => categorySelector.addSelected(l));
  redraw();
}


// Link up to buttons
document.getElementById("clearWeapons")!.onclick = () => weaponSelector.clearSelection();
document.getElementById("randomWeapons")!.onclick = random;
document.getElementById("allWeapons")!.onclick = () => weaponSelector.selectAll();

document.getElementById("clearCategories")!.onclick = () => categorySelector.clearSelection();
document.getElementById("allCategories")!.onclick = () => categorySelector.selectAll();

// Link up Share button
document.getElementById("share")!.onclick = () => {
  navigator.clipboard.writeText(window.location.toString());
  alert("Copied to clipboard!");
};

// Use query string to init values if possible
const params = new URLSearchParams(location.search);

let initialNumTargets = params.get("numberOfTargets") ? Number.parseInt(params.get("numberOfTargets")!) : 1;

new InputHandler(
  "#numberOfTargets",
  "numberOfTargetsOutput",
  initialNumTargets,
  (input: number) => input.toString(),
  (input: number) => {
    numberOfTargets = input;
    redraw();
  }
);

new InputHandler(
  "#horsebackDamageMultiplier",
  "horsebackDamageMultiplierOutput",
  0,
  (input: number) => input + "%",
  (input: number) => {
    horsebackDamageMultiplier = 1 + input/100.0;
    redraw();
  }
);


if(params.get("tab")) {
  selectedTab = params.get("tab")!;
}
const tab = document.querySelector(`#${selectedTab}`)!
tab.classList.add("active");
tab.ariaSelected = "true";
const targetPaneId = selectedTab.replaceAll("-tab", "");
const targetPane = document.querySelector(`#${targetPaneId}`)!;
targetPane.classList.add("active", "show");

if (params.get("target")) {
  selectedTarget = params.get("target") as Target;
}


if (params.getAll("weapon").length) {
  params.getAll("weapon").forEach((name) => {
    let weapon = weaponByName(name);
    if (weapon) { weaponSelector.addSelected(weapon) }
    else {
      name.split("-").map(weaponById).filter(a => a).map(a => a!).forEach((w) => weaponSelector.addSelected(w))
    }
  });
} else {
  random();
}

if (params.getAll("category").length) {
  // Backwards Compat
  let compatCategories = params.getAll("category").map((c) => {
    let result = c.replaceAll("Horizontal", "Slash")
    return result
  });

  compatCategories.forEach(c => categorySelector.addSelected(c as MetricLabel))

  // Setting them failed, so just default
  if (!categorySelector.selectedItems.size)
    reset();
} else {
  reset();
}


// Link up target radio buttons
Object.values(Target).forEach((t) => {
  const radio = document.getElementById(toId(t)) as HTMLInputElement;
  radio.onclick = () => {
    selectedTarget = t;
    redraw();
  };
  radio.checked = selectedTarget === t;
});

window.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('#graph-tabs [role="tab"]');
  // const tabList = document.querySelector('#graph-tabs[role="tablist"]');
  
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      selectedTab = tab.id;
      redraw();
    });
  });
});


weaponSelector.initialize();
categorySelector.initialize();
redraw();
