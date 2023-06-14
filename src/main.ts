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

const weaponSearchResults: Set<Weapon> = new Set<Weapon>();
const categorySearchResults: Set<MetricLabel> = new Set<MetricLabel>();

const weaponSearchResultsElem = document.querySelector<HTMLDivElement>("#weaponSearchResults")!
const displayedWeaponsElem = document.querySelector<HTMLFieldSetElement>("#displayedWeapons")!;

const categorySearchResultsElem = document.querySelector<HTMLFieldSetElement>("#categorySearchResults")!;
const displayedCategoriesElem = document.querySelector<HTMLFieldSetElement>("#displayedCategories")!;


const categoryPresets: Map<string, MetricLabel[]> = new Map()

categoryPresets.set("Windup", [
  MetricLabel.WINDUP_SLASH_LIGHT,
  MetricLabel.WINDUP_SLASH_HEAVY,
  MetricLabel.WINDUP_OVERHEAD_LIGHT,
  MetricLabel.WINDUP_OVERHEAD_HEAVY,
  MetricLabel.WINDUP_STAB_LIGHT,
  MetricLabel.WINDUP_STAB_HEAVY,
  MetricLabel.WINDUP_SPECIAL,
  MetricLabel.WINDUP_LEAPING_STRIKE,
  MetricLabel.WINDUP_THROW,
])

categoryPresets.set("Release", [
  MetricLabel.RELEASE_SLASH_LIGHT,
  MetricLabel.RELEASE_SLASH_HEAVY,
  MetricLabel.RELEASE_OVERHEAD_LIGHT,
  MetricLabel.RELEASE_OVERHEAD_HEAVY,
  MetricLabel.RELEASE_STAB_LIGHT,
  MetricLabel.RELEASE_STAB_HEAVY,
  MetricLabel.RELEASE_SPECIAL,
  MetricLabel.RELEASE_LEAPING_STRIKE,
  MetricLabel.RELEASE_THROW,
])
categoryPresets.set("Recovery", [
  MetricLabel.RECOVERY_SLASH_LIGHT,
  MetricLabel.RECOVERY_SLASH_HEAVY,
  MetricLabel.RECOVERY_OVERHEAD_LIGHT,
  MetricLabel.RECOVERY_OVERHEAD_HEAVY,
  MetricLabel.RECOVERY_STAB_LIGHT,
  MetricLabel.RECOVERY_STAB_HEAVY,
  MetricLabel.RECOVERY_SPECIAL,
  MetricLabel.RECOVERY_THROW,
])

categoryPresets.set("Combo", [
  MetricLabel.COMBO_SLASH_LIGHT,
  MetricLabel.COMBO_SLASH_HEAVY,
  MetricLabel.COMBO_OVERHEAD_LIGHT,
  MetricLabel.COMBO_OVERHEAD_HEAVY,
  MetricLabel.COMBO_STAB_LIGHT,
  MetricLabel.COMBO_STAB_HEAVY,
  MetricLabel.COMBO_LEAPING_STRIKE,
])

categoryPresets.set("All Damage", [
  MetricLabel.DAMAGE_SLASH_LIGHT,
  MetricLabel.DAMAGE_SLASH_HEAVY,
  MetricLabel.DAMAGE_OVERHEAD_LIGHT,
  MetricLabel.DAMAGE_OVERHEAD_HEAVY,
  MetricLabel.DAMAGE_STAB_LIGHT,
  MetricLabel.DAMAGE_STAB_HEAVY,
  MetricLabel.DAMAGE_SPECIAL,
  MetricLabel.DAMAGE_LEAPING_STRIKE,
  MetricLabel.DAMAGE_THROW,
])

categoryPresets.set("Light Damage", [
  MetricLabel.DAMAGE_SLASH_LIGHT,
  MetricLabel.DAMAGE_OVERHEAD_LIGHT,
  MetricLabel.DAMAGE_STAB_LIGHT,
])

categoryPresets.set("Heavy Damage", [
  MetricLabel.DAMAGE_SLASH_HEAVY,
  MetricLabel.DAMAGE_OVERHEAD_HEAVY,
  MetricLabel.DAMAGE_STAB_HEAVY,
])

categoryPresets.set("Range", [
  MetricLabel.RANGE_SLASH,
  MetricLabel.RANGE_ALT_SLASH,
  MetricLabel.RANGE_OVERHEAD,
  MetricLabel.RANGE_ALT_OVERHEAD,
  MetricLabel.RANGE_STAB,
  MetricLabel.RANGE_ALT_STAB,
])

categoryPresets.set("Slash", [
  MetricLabel.DAMAGE_SLASH_LIGHT,
  MetricLabel.DAMAGE_SLASH_HEAVY,
  MetricLabel.RANGE_SLASH,
  MetricLabel.RANGE_ALT_SLASH,
  MetricLabel.WINDUP_SLASH_LIGHT,
  MetricLabel.WINDUP_SLASH_HEAVY,
  MetricLabel.RELEASE_SLASH_LIGHT,
  MetricLabel.RELEASE_SLASH_HEAVY,
  MetricLabel.RECOVERY_SLASH_LIGHT,
  MetricLabel.RECOVERY_SLASH_HEAVY,
  MetricLabel.COMBO_SLASH_LIGHT,
  MetricLabel.COMBO_SLASH_HEAVY,
])

categoryPresets.set("Overhead", [
  MetricLabel.DAMAGE_OVERHEAD_LIGHT,
  MetricLabel.DAMAGE_OVERHEAD_HEAVY,
  MetricLabel.RANGE_OVERHEAD,
  MetricLabel.RANGE_ALT_OVERHEAD,
  MetricLabel.WINDUP_OVERHEAD_LIGHT,
  MetricLabel.WINDUP_OVERHEAD_HEAVY,
  MetricLabel.RELEASE_OVERHEAD_LIGHT,
  MetricLabel.RELEASE_OVERHEAD_HEAVY,
  MetricLabel.RECOVERY_OVERHEAD_LIGHT,
  MetricLabel.RECOVERY_OVERHEAD_HEAVY,
  MetricLabel.COMBO_OVERHEAD_LIGHT,
  MetricLabel.COMBO_OVERHEAD_HEAVY,
])

categoryPresets.set("Stab", [
  MetricLabel.DAMAGE_STAB_LIGHT,
  MetricLabel.DAMAGE_STAB_HEAVY,
  MetricLabel.RANGE_STAB,
  MetricLabel.RANGE_ALT_STAB,
  MetricLabel.WINDUP_STAB_LIGHT,
  MetricLabel.WINDUP_STAB_HEAVY,
  MetricLabel.RELEASE_STAB_LIGHT,
  MetricLabel.RELEASE_STAB_HEAVY,
  MetricLabel.RECOVERY_STAB_LIGHT,
  MetricLabel.RECOVERY_STAB_HEAVY,
  MetricLabel.COMBO_STAB_LIGHT,
  MetricLabel.COMBO_STAB_HEAVY,
])

categoryPresets.set("Throw", [
  MetricLabel.DAMAGE_THROW,
  MetricLabel.WINDUP_THROW,
  MetricLabel.RELEASE_THROW,
  MetricLabel.RECOVERY_THROW,
])

categoryPresets.set("Special", [
  MetricLabel.DAMAGE_SPECIAL,
  MetricLabel.WINDUP_SPECIAL,
  MetricLabel.RELEASE_SPECIAL,
  MetricLabel.RECOVERY_SPECIAL,
])

categoryPresets.set("Leaping Strike", [
  MetricLabel.DAMAGE_LEAPING_STRIKE,
  MetricLabel.WINDUP_LEAPING_STRIKE,
  MetricLabel.RELEASE_LEAPING_STRIKE,
  MetricLabel.COMBO_LEAPING_STRIKE,
])

categoryPresets.set("Sprint Charge", [
  MetricLabel.DAMAGE_SPRINT_CHARGE,
])

categoryPresets.set("Average", [
  MetricLabel.DAMAGE_LIGHT_AVERAGE,
  MetricLabel.DAMAGE_HEAVY_AVERAGE,
  MetricLabel.WINDUP_LIGHT_AVERAGE,
  MetricLabel.WINDUP_HEAVY_AVERAGE,
  MetricLabel.RELEASE_LIGHT_AVERAGE,
  MetricLabel.RELEASE_HEAVY_AVERAGE,
  MetricLabel.RECOVERY_LIGHT_AVERAGE,
  MetricLabel.RECOVERY_HEAVY_AVERAGE,
  MetricLabel.COMBO_LIGHT_AVERAGE,
  MetricLabel.COMBO_HEAVY_AVERAGE,
  MetricLabel.RANGE_AVERAGE,
  MetricLabel.RANGE_ALT_AVERAGE
])

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
    outer.id = c + "-bar";
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

  displayedWeaponsElem.appendChild(div);
}

function addCategoryDiv(l: MetricLabel) {
  const div = document.createElement("div");
  div.id = l;
  div.className = "labelled-input";
  div.style.display = "flex";
  div.style.alignItems = "center";

  const input = document.createElement("input");
  input.id = `input-${l}`;
  input.checked = true;
  input.type = "checkbox";
  input.className = "form-check-input";
  input.onchange = () => {
    setCategory(l, false);
    updateCategorySearchResults();
    redraw();
  };
  div.appendChild(input);

  const label = document.createElement("label");
  label.htmlFor = `input-${l}`;
  label.innerText = l;
  label.style.padding = "0.2em";
  div.appendChild(label);

  displayedCategoriesElem.appendChild(div);
}

// Add an input checkbox with a border to show the weapon has been added
// Allow the weapon to be removed by unchecking the checkbox
function addWeapon(weapon: Weapon) {
  addWeaponDiv(weapon);

  selectedWeapons.add(weapon);
  redraw();

  updateWeaponSearchResults();
}

function removeWeapon(weapon: Weapon) {
  displayedWeaponsElem.removeChild(document.getElementById(weapon.name)!);

  selectedWeapons.delete(weapon);
  redraw();

  updateWeaponSearchResults();
}

const weaponSearch = document.getElementById("weaponSearch") as HTMLInputElement;
weaponSearch.onfocus = () => {
  weaponSearchResultsElem.style.display = "initial";
};
weaponSearch.onblur = () => {
  // Clear search when clicking out
  weaponSearch.value = "";
  updateWeaponSearchResults();

  weaponSearchResultsElem.style.display = "none";
};
weaponSearch.oninput = updateWeaponSearchResults;

const categorySearch = document.getElementById("categorySearch") as HTMLInputElement;
categorySearch.onfocus = () => {
  categorySearchResultsElem.style.display = "initial";
};
categorySearch.onblur = () => {
  // Clear search when clicking out
  categorySearch.value = "";
  updateCategorySearchResults();

  categorySearchResultsElem.style.display = "none";
};
categorySearch.oninput = updateCategorySearchResults;

function setCategory(category: MetricLabel, enabled: boolean) {
  if (enabled) {
    selectedCategories.add(category);
    addCategoryDiv(category);
  } else {
    selectedCategories.delete(category);
    displayedCategoriesElem.removeChild(document.getElementById(category)!);
  }
}

// Clear all weapon selections
function clearWeapons() {
  selectedWeapons.clear();
  while (displayedWeaponsElem.firstChild) {
    displayedWeaponsElem.removeChild(displayedWeaponsElem.firstChild);
  }

  addWeapon(weaponByName("Polehammer")!)
  redraw();
  updateWeaponSearchResults();
}

// Clear all weapon selections
function clearCategories() {
  selectedCategories.clear();
  while (displayedCategoriesElem.firstChild) {
    displayedCategoriesElem.removeChild(displayedCategoriesElem.firstChild);
  }

  redraw();
  updateWeaponSearchResults();
}

// Choose 3 random weapons
function random() {
  clearWeapons();
  const random = shuffle(ALL_WEAPONS.filter(x => x.name != "Polehammer"));
  random.slice(0, 2).forEach(addWeapon);
}

// Choose all weapons
function allWeapons() {
  ALL_WEAPONS.forEach((w) => {
    if(!selectedWeapons.has(w)) {
      selectedWeapons.add(w);
      addWeaponDiv(w);
    }
  });
  updateWeaponSearchResults();
  redraw();
}

function allCategories() {
  Object.values(MetricLabel).forEach((l) => {
    if(!selectedCategories.has(l)) {
      setCategory(l, true);
    }
  });
  updateCategorySearchResults();
  redraw();
}

// Reset to default category selections
// Clear all weapon selections
function reset() {
  selectedCategories.clear();
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
  ].map(l => setCategory(l, true));
  redraw();
}


// Link up to buttons
document.getElementById("clearWeapons")!.onclick = clearWeapons;
document.getElementById("randomWeapons")!.onclick = random;
document.getElementById("allWeapons")!.onclick = allWeapons;

document.getElementById("clearCategories")!.onclick = clearCategories;
document.getElementById("allCategories")!.onclick = allCategories;

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

let weaponPresetsSelect = document.querySelector<HTMLSelectElement>("#presetsSelectWeapon")!;
let categoryPresetsSelect = document.querySelector<HTMLSelectElement>("#presetsSelectCategory")!;

Object.values(WeaponType).forEach(wt => {
  let elem = new Option(wt, wt) 
  weaponPresetsSelect.add(elem);
});

weaponPresetsSelect.onchange = (_ => {
  clearWeapons();
  let preset = weaponPresetsSelect.value
  ALL_WEAPONS.filter(w => w.weaponTypes.includes(preset as WeaponType)).forEach(w => {
    addWeapon(w);
  });
});

categoryPresets.forEach((_, key) =>  {
  let elem = new Option(key, key)
  categoryPresetsSelect.add(elem);  
});

categoryPresetsSelect.onchange = (_ => {
  clearCategories();
  let preset = categoryPresetsSelect.value
  categoryPresets.get(preset)!.forEach(l => {
    setCategory(l, true);
    updateCategorySearchResults();
  })
  redraw();
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
function updateWeaponSearchResults() {
  // Start assuming no search results
  weaponSearchResults.clear();

  // Take search text into account
  const searchText = weaponSearch.value?.toLowerCase();
  if (searchText) {
    ALL_WEAPONS.forEach((w) => {
      if (w.name.toLowerCase().includes(searchText)) {
        weaponSearchResults.add(w);
      }
    });
  } else {
    ALL_WEAPONS.forEach((w) => weaponSearchResults.add(w));
  }

  // Remove any we already have selected
  selectedWeapons.forEach((w) => weaponSearchResults.delete(w));

  // Clear existing buttons
  while (weaponSearchResultsElem.firstChild) {
    weaponSearchResultsElem.removeChild(weaponSearchResultsElem.firstChild);
  }

  // Add a button for each search result
  weaponSearchResults.forEach((w) => {
    const button = document.createElement("button");
    button.className = "searchResult";
    button.innerText = w.name;
    button.onmousedown = (ev) => ev.preventDefault(); // Stop the blur from occurring that will hide the button itself
    button.onclick = () => addWeapon(w);
    weaponSearchResultsElem.appendChild(button);
  });
}

function updateCategorySearchResults() {
  // Start assuming no search results
  categorySearchResults.clear();

  // Take search text into account
  const searchText = categorySearch.value?.toLowerCase();
  if (searchText) {
    Object.values(MetricLabel).forEach((l) => {
      if (l.toLowerCase().includes(searchText)) {
        categorySearchResults.add(l);
      }
    });
  } else {
    Object.values(MetricLabel).forEach(x => categorySearchResults.add(x));
  }

  // Remove any we already have selected
  selectedCategories.forEach(l => categorySearchResults.delete(l));

  // Clear existing buttons
  while (categorySearchResultsElem.firstChild) {
    categorySearchResultsElem.removeChild(categorySearchResultsElem.firstChild);
  }

  // Add a button for each search result
  categorySearchResults.forEach((l) => {
    const button = document.createElement("button");
    button.className = "searchResult";
    button.innerText = l;
    button.onmousedown = (ev) => ev.preventDefault(); // Stop the blur from occurring that will hide the button itself
    button.onclick = () => {
      setCategory(l, true);
      updateCategorySearchResults();
      redraw();
    };
    categorySearchResultsElem.appendChild(button);
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


updateWeaponSearchResults();
updateCategorySearchResults();
redraw();
