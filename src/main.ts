import { Chart, ChartData, registerables } from "chart.js";
import ALL_WEAPONS, { weaponByName, weaponById } from "./all_weapons";
import { MetricLabel } from "./metrics";
import {
  generateMetrics,
  unitGroupStats,
  UnitStats,
  WeaponStats,
} from "./stats";
import "./style.scss";
import { Target } from "./target";
import { borderDash, weaponColor, weaponDash, metricColor } from "./ui";
import { shuffle } from "./util";
import { Weapon } from "./weapon";
import { SearchSelector } from "./components/search_selector";
import CATEGORY_PRESETS from "./components/category_presets";
import WEAPON_PRESETS from "./components/weapon_presets";

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

function toId(str: string) {
  return str
    .replaceAll(" ", "_")
    .replaceAll("/", "-")
    .replaceAll("(", ":")
    .replaceAll(")", ":");
}

// Normalization will only occur for stat types that have a unit present in the provided normalizationStats.
// This allows for selective normalization, like for bar charts where we wan't mostly raw data, except for
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
    datasets: [...weaponSelector.display].map((w) => {
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

const radar: Chart = new Chart(
  document.getElementById("radar") as HTMLCanvasElement,
  {
    type: "radar",
    options: {
      animation: false,
      plugins: {
        legend: {
          display: false,
          position: "bottom",
        },
      },
      responsive: true,
      maintainAspectRatio: true,
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
    data: chartData(stats, categorySelector.display, unitStats, false),
  }
);

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

  categorySelector.display.forEach((c) => {
    const outer = document.createElement("div");
    outer.className = "col-md-4";
    outer.id = c + "-bar";
    const elem = document.createElement("canvas");
    outer.appendChild(elem);
    barsElem.appendChild(outer);
    bars.push(createBarChart(elem, c));
  });
}

function redrawTable(dataset: WeaponStats, unitStats: UnitStats) {
  let sortedCategories = Array.from(categorySelector.display);
  sortedCategories.sort((a,b) => {
    return Object.values(MetricLabel).indexOf(a) - Object.values(MetricLabel).indexOf(b);
  });

  const tableElem = document.getElementById("statTable")!;
  tableElem.innerHTML = "";

  const table = document.createElement("table");
  table.className = "table";

  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  


  let headers = [""]; // Leave name column blank
  sortedCategories.forEach((c) => {
    headers.push(c);
  });

  let first = false;

  headers.forEach(header => {
    let headerCol = document.createElement("th");
    let headerDiv = document.createElement("div");
    let headerSpan = document.createElement("span");

    if(!first)
      headerCol.className = "rotated-text";

    headerCol.scope = "col";

    headerSpan.innerHTML = header;
    headerSpan.className = "border-bottom";


    headerDiv.appendChild(headerSpan);
    headerCol.appendChild(headerDiv);
    headRow.appendChild(headerCol);

    first = false;
  });
  head.appendChild(headRow);
  table.appendChild(head);

  weaponSelector.display.forEach(weapon => {
    let weaponData = dataset.get(weapon.name)!;

    let row = document.createElement("tr");

    let firstCell = document.createElement("th");
    firstCell.innerHTML = weapon.name;
    firstCell.scope = "row";
    firstCell.className = "border w-25";
    row.appendChild(firstCell);

    sortedCategories.forEach(category => {
      let metric = weaponData.get(category)!;

      let cellContent: string = Math.round(metric.value.rawResult).toString();

      let cell = document.createElement("td");

      cell.innerHTML = cellContent;
      cell.className = "border";
      cell.style.backgroundColor = metricColor(metric.value.result, unitStats.get(category)!);

      row.appendChild(cell);
    });
    table.appendChild(row);
  });
  
  tableElem.appendChild(table);
}

function redraw() {

  stats = generateMetrics(ALL_WEAPONS, numberOfTargets, horsebackDamageMultiplier, selectedTarget)
  unitStats = unitGroupStats(stats);

  let weaponArray = Array.from(weaponSelector.display)
  const INDEX_POSTITIONS: Map<string, Array<string>> = new Map()
  const indexCategories = Array.from(categorySelector.display).filter(c => c.startsWith("Index"))
  indexCategories.forEach((c) => {
    const sortedWeapons = 
        weaponArray.sort((a,b) => {
          const l = stats.get(b.name)!.get(c)!.value.result;
          const r = stats.get(a.name)!.get(c)!.value.result;
          return l - r;
        });

    INDEX_POSTITIONS.set(c, sortedWeapons.map(x => x.name))
  })

  indexCategories.forEach(c => {
    weaponArray.forEach(w => {
      const value = stats.get(w.name)!.get(c)!.value
      const idx = INDEX_POSTITIONS.get(c)!.indexOf(w.name);
      value.rawResult = idx + 1;
      value.result = weaponSelector.display.size - idx;
    });
    unitStats.get(c)!.max = weaponSelector.display.size;
    unitStats.get(c)!.min = 1;
  });


  radar.data = chartData(stats, categorySelector.display, unitStats, false);
  radar.update();

  redrawBars();
  redrawTable(stats, unitStats);

  // Update content of location string so we can share
  const params = new URLSearchParams();
  params.set("target", selectedTarget);
  params.set("numberOfTargets", numberOfTargets.toString());
  params.set("tab", selectedTab);
  params.append("weapon", [...weaponSelector.display].map(x => x.id).join("-"));
  [...categorySelector.display].map((c) => params.append("category", c));
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

let numberOfTargetsInput = document.querySelector<HTMLInputElement>("#numberOfTargets")!;
let numberOfTargetsOutput = document.getElementById("numberOfTargetsOutput")!;

numberOfTargetsInput.oninput = () => {
  numberOfTargetsOutput.innerHTML = numberOfTargetsInput.value
  numberOfTargets = Number.parseInt(numberOfTargetsInput.value)
  redraw();
}

let horsebackDamageMultiplierInput = document.querySelector<HTMLInputElement>("#horsebackDamageMultiplier")!;
let horsebackDamageMultiplierOutput = document.getElementById("horsebackDamageMultiplierOutput")!;

horsebackDamageMultiplierInput.oninput = () => {
  let rawInput = Number.parseInt(horsebackDamageMultiplierInput.value)
  horsebackDamageMultiplierOutput.innerHTML = rawInput + "%";
  horsebackDamageMultiplier = 1 + rawInput/100.0;
  redraw();
}

// Use query string to init values if possible
const params = new URLSearchParams(location.search);

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

if (params.get("numberOfTargets")) {
  numberOfTargets = Number.parseInt(params.get("numberOfTargets")!);
  numberOfTargetsOutput.innerHTML = numberOfTargets.toString();
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
  if (!categorySelector.display.size)
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
