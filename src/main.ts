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
import { Weapon, WeaponType } from "./weapon";

Chart.defaults.font.family = "'Lato', sans-serif";
Chart.register(...registerables); // the auto import stuff was making typescript angry.

let selectedTarget = Target.AVERAGE;
let numberOfTargets = 1;
let horsebackDamageMultiplier = 1.0;

let stats: WeaponStats = generateMetrics(ALL_WEAPONS, 1, 1, Target.VANGUARD_ARCHER);
let unitStats: UnitStats = unitGroupStats(stats);

let selectedTab = "radar-content-tab";

const selectedWeapons: Set<Weapon> = new Set<Weapon>();
const selectedCategories: Set<MetricLabel> = new Set<MetricLabel>();
const searchResults: Set<Weapon> = new Set<Weapon>();

const weaponSearchResults = document.querySelector<HTMLDivElement>("#weaponSearchResults")!
const displayedWeapons = document.querySelector<HTMLFieldSetElement>("#displayedWeapons")!;

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
    datasets: [...selectedWeapons].map((w) => {
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
    data: chartData(stats, selectedCategories, unitStats, false),
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

  selectedCategories.forEach((c) => {
    const outer = document.createElement("div");
    outer.className = "col-md-4";
    outer.id = c;
    const elem = document.createElement("canvas");
    outer.appendChild(elem);
    barsElem.appendChild(outer);
    bars.push(createBarChart(elem, c));
  });
}

function redrawTable(dataset: WeaponStats, unitStats: UnitStats) {
  let sortedCategories = Array.from(selectedCategories);
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

  selectedWeapons.forEach(weapon => {
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

  let weaponArray = Array.from(selectedWeapons)
  const INDEX_POSTITIONS: Map<string, Array<string>> = new Map()
  const indexCategories = Array.from(selectedCategories).filter(c => c.startsWith("Index"))
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
      value.result = selectedWeapons.size - idx;
    });
    unitStats.get(c)!.max = selectedWeapons.size;
    unitStats.get(c)!.min = 1;

  });


  radar.data = chartData(stats, selectedCategories, unitStats, false);
  radar.update();

  redrawBars();
  redrawTable(stats, unitStats);

  // Update content of location string so we can share
  const params = new URLSearchParams();
  params.set("target", selectedTarget);
  params.set("numberOfTargets", numberOfTargets.toString());
  params.set("tab", selectedTab);
  params.append("weapon", [...selectedWeapons].map(x => x.id).join("-"));
  [...selectedCategories].map((c) => params.append("category", c));
  window.history.replaceState(null, "", `?${params.toString()}`);
}

function addWeaponDiv(weapon: Weapon) {
  const div = document.createElement("div");
  div.id = weapon.name;
  div.className = "labelled-input";
  div.style.display = "flex";
  div.style.alignItems = "center";

  const input = document.createElement("input");
  input.id = `input-${weapon.name}`;
  input.checked = true;
  input.type = "checkbox";
  input.className = "form-check-input";
  input.onchange = () => {
    removeWeapon(weapon);
  };
  div.appendChild(input);

  const label = document.createElement("label");
  label.htmlFor = `input-${weapon.name}`;
  label.innerText = weapon.name;
  label.style.padding = "0.2em";
  label.style.border = `3px ${weaponDash(weapon)} ${weaponColor(weapon, 0.6)}`;
  div.appendChild(label);

  displayedWeapons.appendChild(div);
}

// Add an input checkbox with a border to show the weapon has been added
// Allow the weapon to be removed by unchecking the checkbox
function addWeapon(weapon: Weapon) {
  addWeaponDiv(weapon);

  selectedWeapons.add(weapon);
  redraw();

  updateSearchResults();
}

function removeWeapon(weapon: Weapon) {
  displayedWeapons.removeChild(document.getElementById(weapon.name)!);

  selectedWeapons.delete(weapon);
  redraw();

  updateSearchResults();
}

const weaponSearch = document.getElementById(
  "weaponSearch"
) as HTMLInputElement;
weaponSearch.onfocus = () => {
  weaponSearchResults.style.display = "initial";
};
weaponSearch.onblur = () => {
  // Clear search when clicking out
  weaponSearch.value = "";
  updateSearchResults();

  weaponSearchResults.style.display = "none";
};
weaponSearch.oninput = updateSearchResults;

function setCategory(category: MetricLabel, enabled: boolean) {
  const checkbox = document.getElementById(toId(category)) as HTMLInputElement;

  // Manually typing into URL, or old URL and we've changed category names
  if (!checkbox) {
    return;
  }

  checkbox.checked = enabled;

  if (enabled) {
    selectedCategories.add(category);
  } else {
    selectedCategories.delete(category);
  }
  redraw();
}

// Write all categories we know about into the categories list
Object.values(MetricLabel).forEach((r) => {
  const [group, name] = r.split(" - ");

  const div = document.createElement("div");

  const input = document.createElement("input");
  input.id = toId(r);
  input.checked = selectedCategories.has(r);
  input.className = "form-check-input";
  input.setAttribute("type", "checkbox");
  input.onclick = (ev) => {
    const enabled = (ev.target as HTMLInputElement).checked;
    setCategory(r, enabled);
  };
  div.className = "labelled-input";
  div.appendChild(input);

  const label = document.createElement("label");
  label.htmlFor = toId(r);
  label.innerText = name;
  div.appendChild(label);

  const categoryGroup = document.getElementById(
    `category-${group.replaceAll(' ','-').toLowerCase()}`
  ) as HTMLFieldSetElement;
  categoryGroup.appendChild(div);
});

// Clear all weapon selections
function clear() {
  selectedWeapons.clear();
  while (displayedWeapons.firstChild) {
    displayedWeapons.removeChild(displayedWeapons.firstChild);
  }

  addWeapon(weaponByName("Polehammer")!)
  redraw();
  updateSearchResults();
}

// Choose 3 random weapons
function random() {
  clear();
  const random = shuffle(ALL_WEAPONS.filter(x => x.name != "Polehammer"));
  random.slice(0, 2).forEach(addWeapon);
}

// Choose all weapons
function all() {
  ALL_WEAPONS.forEach((w) => {
    if(!selectedWeapons.has(w)) {
      selectedWeapons.add(w);
      addWeaponDiv(w);
    }
  });
  updateSearchResults();
  redraw();
}

// Reset to default category selections
// Clear all weapon selections
function reset() {
  selectedCategories.clear();
  selectedCategories.add(MetricLabel.SPEED_AVERAGE);
  selectedCategories.add(MetricLabel.RANGE_AVERAGE);
  selectedCategories.add(MetricLabel.DAMAGE_LIGHT_AVERAGE);
  selectedCategories.add(MetricLabel.DAMAGE_HEAVY_AVERAGE);
  selectedCategories.add(MetricLabel.DAMAGE_RANGED_AVERAGE);
  selectedCategories.add(MetricLabel.POLEHAMMER_INDEX);
  Object.values(MetricLabel).map((r) => {
    const checkbox = document.getElementById(toId(r)) as HTMLInputElement;
    checkbox.checked = selectedCategories.has(r);
  });
  redraw();
}


// Link up to buttons
document.getElementById("clear")!.onclick = clear;
document.getElementById("random")!.onclick = random;
document.getElementById("all")!.onclick = all;
document.getElementById("reset")!.onclick = reset;

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

let presetsSelect = document.querySelector<HTMLSelectElement>("#presetsSelect")!;

Object.values(WeaponType).forEach(wt => {
  let elem = new Option(wt, wt) 
  presetsSelect.add(elem);
});

presetsSelect.onchange = (_ => {
  clear();
  let preset = presetsSelect.value
  ALL_WEAPONS.filter(w => w.weaponTypes.includes(preset as WeaponType)).forEach(w => {
    addWeapon(w);
  });
});

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
    if (weapon) { addWeapon(weapon) }
    else {
      name.split("-").map(weaponById).filter(a => a).map(a => a!).forEach(addWeapon)
    }
  });
} else {
  random();
}

if (params.getAll("category").length) {
  // Backwards Compat
  let compatCategories = params.getAll("category").map((c) => {
    let result = c.replaceAll("Horizontal", "Slash")
    if(result.includes("Speed"))
       result = result.replaceAll(" (Light)", "")
    return result
  });

  compatCategories.forEach(c => setCategory(c as MetricLabel, true))

  // Setting them failed, so just default
  if (!selectedCategories.size)
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

// - Take into account weapons that are already selected
// - Take into account any filters that are applied
// - Clear out existing buttons and write new ones depending on the results
// - If no results, have special entry
function updateSearchResults() {
  // Start assuming no search results
  searchResults.clear();

  // Take search text into account
  const searchText = weaponSearch.value?.toLowerCase();
  if (searchText) {
    ALL_WEAPONS.forEach((w) => {
      if (w.name.toLowerCase().includes(searchText)) {
        searchResults.add(w);
      }
    });
  } else {
    ALL_WEAPONS.forEach((w) => searchResults.add(w));
  }

  // Remove any we already have selected
  selectedWeapons.forEach((w) => searchResults.delete(w));

  // Clear existing buttons
  while (weaponSearchResults.firstChild) {
    weaponSearchResults.removeChild(weaponSearchResults.firstChild);
  }

  // Add a button for each search result
  searchResults.forEach((w) => {
    const button = document.createElement("button");
    button.className = "searchResult";
    button.innerText = w.name;
    button.onmousedown = (ev) => ev.preventDefault(); // Stop the blur from occurring that will hide the button itself
    button.onclick = () => addWeapon(w);
    weaponSearchResults.appendChild(button);
  });
}

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


updateSearchResults();
