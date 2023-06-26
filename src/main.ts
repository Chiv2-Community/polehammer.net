import { Chart, registerables } from "chart.js";
import { ALL_WEAPONS, Weapon, weaponByName, weaponById, Target } from "chivalry2-weapons";
import { MetricLabel, MetricResult } from "./metrics";
import {
  generateMetrics,
  unitGroupStats,
  UnitStats,
  WeaponStats,
} from "./stats";
import "./style.scss";
import { deleteChildren, metricColor, weaponColor, weaponDash } from "./ui";
import { shuffle } from "./util";
import { SearchSelector } from "./components/search_selector";
import CATEGORY_PRESETS from "./components/category_presets";
import WEAPON_PRESETS from "./components/weapon_presets";
import { Table } from "./components/table";
import { InputHandler } from "./components/input_slider";
import { BarChart, RadarChart } from "./components/chart";
import { generateNormalizedChartData, weaponsToRows } from "./data";

Chart.defaults.font.family = "'Lato', sans-serif";
Chart.register(...registerables); // the auto import stuff was making typescript angry.

let selectedTarget = Target.AVERAGE;
let numberOfTargets = 1;
let horsebackDamageMultiplier = 1.0;

let stats: WeaponStats = generateMetrics(ALL_WEAPONS, 1, 1, Target.VANGUARD);
let unitStats: UnitStats = unitGroupStats(stats);

let selectedTab = "radar-content-tab";

let weaponBorderStyle = (weapon: Weapon, label: HTMLLabelElement) => {
  label.style.border = `3px ${weaponDash(weapon)} ${weaponColor(weapon, 0.6)}`;
  return label
}

export const weaponSelector = new SearchSelector<Weapon>(
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

const radar: RadarChart = new RadarChart("#radar");
const bars = new Array<BarChart>();

function createBarChart(element: HTMLCanvasElement, category: MetricLabel): BarChart {
  const barUnitStats: UnitStats = new Map();
  if(category.includes("Speed")) {
    barUnitStats.set(category, unitStats.get(category)!);
  }

  let chart = new BarChart(element)
  chart.render(
    generateNormalizedChartData(
      stats, 
      weaponSelector.selectedItems, 
      new Set([category]), 
      barUnitStats, 
      true
    )
  )
  return chart;
}

function redrawBars() {
  const barsElem = document.getElementById("bars")!;
  bars.forEach(b => b.destroy());

  deleteChildren(barsElem)

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
  table.setHeaders([...categorySelector.selectedItems]);
  table.draw(weaponsToRows(weaponSelector.selectedItems, categorySelector.selectedItems, stats));
}

function redraw() {
  stats = generateMetrics(ALL_WEAPONS, numberOfTargets, horsebackDamageMultiplier, selectedTarget)
  unitStats = unitGroupStats(stats);

  radar.render(generateNormalizedChartData(stats, weaponSelector.selectedItems, categorySelector.selectedItems, unitStats, false));

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
function randomWeapons() {
  weaponSelector.clearSelection();
  const random = shuffle(ALL_WEAPONS.filter(x => x.name != "Polehammer"));
  weaponSelector.addSelected(weaponById("ph")!)
  random.slice(0, 2).forEach(w => weaponSelector.addSelected(w));
}

// Reset to default category selections
// Clear all weapon selections
function resetCategories() {
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
document.getElementById("randomWeapons")!.onclick = randomWeapons;
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
  randomWeapons();
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
    resetCategories();
} else {
  resetCategories();
}


// Link up target radio buttons
Object.values(Target).forEach((t) => {
  // Vanguard and archer are the same. For target selection we use vanguard in place of archer.
  if(t == Target.ARCHER) 
    return;

  console.log(t);
  const radio = document.getElementById(t) as HTMLInputElement;
  const radioParent = radio.parentElement

  if(!radioParent)
    throw new Error("Failed to find parent of target selection radio element")

  radio.parentElement.onclick = () => {
    selectedTarget = t;
    radio.checked = true;
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
