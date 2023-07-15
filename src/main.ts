import { Chart, registerables } from "chart.js";
import { ALL_WEAPONS, Weapon, weaponByName, weaponById, Target, targetByName, ARCHER, ALL_TARGETS } from "chivalry2-weapons";
import "./style.scss";
import { deleteChildren, metricColor, weaponColor, weaponDash } from "./ui";
import { shuffle } from "./util";
import { SearchSelector } from "./components/search_selector";
import CATEGORY_PRESETS from "./components/category_presets";
import WEAPON_PRESETS from "./components/weapon_presets";
import { Table } from "./components/table";
import { InputHandler } from "./components/input_slider";
import { BarChart, RadarChart } from "./components/chart";
import { 
  generateNormalizedChartData, 
  weaponsToRows,
  WeaponMetric,
  WeaponMetrics,
  generateMetrics,
  metricRanges,
  MetricRanges,
} from "./data";
import { METRICS, METRIC_MAP, Metric } from "./metrics";

Chart.defaults.font.family = "'Lato', sans-serif";
Chart.register(...registerables); // the auto import stuff was making typescript angry.

let selectedTarget = targetByName("Average")!;
let numberOfTargets = 1;
let horsebackDamageMultiplier = 1.0;


let selectedTab = "radar-content-tab";

let weaponBorderStyle = (weapon: Weapon, label: HTMLLabelElement) => {
  label.style.border = `3px ${weaponDash(weapon.name)} ${weaponColor(weapon.name, 0.6)}`;
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

const categorySelector = new SearchSelector<Metric>(
  new Set(METRICS),
  "#categorySearch",
  "#categorySearchResults",
  "#displayedCategories",
  CATEGORY_PRESETS,
  "#presetsSelectCategory",
  m => m.label,
  (_, label) => label,
  redraw
)

let stats: WeaponMetrics = new Map()
let ranges: MetricRanges = new Map()

const table = new Table<WeaponMetric>(
  "#statTable", 
  x => x.result,
  (header, cellData) => {
    cellData = cellData;
    let range = ranges.get(header)!;
    let cellContent: string = Math.round(cellData.result).toString();
    let cell = document.createElement("td");
    cell.innerHTML = cellContent;
    cell.className = "border";
    cell.style.backgroundColor = metricColor(cellData.result, range, !cellData.metric.higherIsBetter);
    return cell;
  }
)

const radar: RadarChart = new RadarChart("#radar");
const bars = new Array<BarChart>();

function createBarChart(element: HTMLCanvasElement, metric: Metric): BarChart {
  let chart = new BarChart(element)

  // We only need results for this bar's metric
  let metricResults: WeaponMetrics = new Map()
  weaponSelector.selectedItems.forEach(w => {
    let innerStats: Map<string, WeaponMetric> = new Map()
    innerStats.set(metric.label, stats.get(w.name)!.get(metric.label)!)
    metricResults.set(w.name, innerStats);
  });

  chart.render(generateNormalizedChartData(ranges, metricResults, true))
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
  table.setHeaders([...categorySelector.selectedItems].map(c => c.label));
  table.draw(weaponsToRows(stats));
}

function redraw() {
  let selectedMetricsArray = [...categorySelector.selectedItems];
  let selectedWeaponsArray = [...weaponSelector.selectedItems];

  stats = generateMetrics(selectedMetricsArray, selectedWeaponsArray, numberOfTargets, horsebackDamageMultiplier, selectedTarget)
  ranges = metricRanges(selectedMetricsArray, ALL_WEAPONS, selectedTarget, numberOfTargets, horsebackDamageMultiplier);

  radar.render(generateNormalizedChartData(ranges, stats, false));

  redrawBars();
  redrawTable();
  updateUrlParams();
}


function updateUrlParams() {
  const params = new URLSearchParams();
  params.set("target", selectedTarget.characterClass);
  params.set("numberOfTargets", numberOfTargets.toString());
  params.set("tab", selectedTab);
  params.append("weapon", [...weaponSelector.selectedItems].map(x => x.id).join("-"));
  params.append("category", [...categorySelector.selectedItems].map(x => x.id).join("-"));
  window.history.replaceState(null, "", `?${params.toString()}`);
}

// Choose 3 random weapons
function randomWeapons() {
  weaponSelector.clearSelection();
  const random = shuffle(ALL_WEAPONS.filter(x => x.name != "Polehammer"));
  weaponSelector.addSelected(weaponById("ph")!, false)
  random.slice(0, 2).forEach(w => weaponSelector.addSelected(w, false));
  redraw();
}

// Reset to default category selections
// Clear all weapon selections
function resetCategories() {
  categorySelector.clearSelection();
  CATEGORY_PRESETS.get("Average")!.forEach(c => categorySelector.addSelected(c));
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
  let targetString = params.get("target");

  if(targetString === null || targetString?.toUpperCase().includes("VANGUARD")) {
    // This selects VANGUARD when a legacy link provides "Vanguard / Archer"
    selectedTarget = targetByName("Vanguard")!;
  } else {
    selectedTarget = targetByName(targetString)!
  }
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
  params.getAll("category").forEach((c) => {
    // Backwards Compat
    let result = c.replaceAll("Horizontal", "Slash")

    // Used to do Range - Alt. foo
    // Now its Alt Range - foo
    if(result.includes("Alt")) {
      result = result.replaceAll(/Alt\.? /ig, "")
      result = "Alt " + result
    }

    let maybeMetric = METRIC_MAP.get(result);
    if(maybeMetric) {
      categorySelector.addSelected(maybeMetric!, false);
    }
    
    let backwardCompatLabel = METRICS.find(m => m.label == result)
    if(backwardCompatLabel) {
      categorySelector.addSelected(backwardCompatLabel, false);
    }
    
    c.split("-")
      .map((id) => METRIC_MAP.get(id))
      .filter(a => a)
      .map(a => a!)
      .forEach((m) => categorySelector.addSelected(m, false));
  });

  // Setting them failed, so just default
  if (!categorySelector.selectedItems.size)
    resetCategories();
} else {
  resetCategories();
}


// Link up target radio buttons
ALL_TARGETS
  // Vanguard and archer are the same. For target selection we use vanguard in place of archer
  // and remove archer from the list
  .filter((t) => t.characterClass != ARCHER.characterClass)
  .forEach((t) => {

  const radio = document.getElementById(t.characterClass) as HTMLInputElement;
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
