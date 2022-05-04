import Chart from "chart.js/auto";
import { Rating } from "./rating";
import "./style.css";
import { Target } from "./target";
import { bonusMult, Weapon } from "./weapon";
import { NORMALIZED_RATINGS } from "./weapon";

let selectedTarget = Target.VANGUARD_ARCHER;

let selectedWeapons = new Set<Weapon>([]);

let selectedCategories = new Set<Rating>([]);

const SATURATION = "85%";
const LIGHTNESS = "45%";
const OPACITY = 0.75;

// Repeat the palette three times:
// Once solid, then once dashed, then once dotted
const PALETTE_SIZE = Object.values(Weapon).length / 3;
const PALETTE_DEGS = [...Array(PALETTE_SIZE)].map((_, idx) => {
  // Cycle through large shifts in the 360deg colour wheel
  // This changes the colour more from one index to another
  // so we don't get "three shades of green" all in a row
  return (idx * 360) / PALETTE_SIZE + (idx % 2) * 180;
});

function weaponColor(weapon: Weapon) {
  const idx = Object.values(Weapon).indexOf(weapon);
  return `hsl(${
    PALETTE_DEGS[idx % PALETTE_DEGS.length]
  }deg, ${SATURATION}, ${LIGHTNESS}, ${OPACITY})`;
}

function weaponDash(weapon: Weapon) {
  const idx = Object.values(Weapon).indexOf(weapon);
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

export function hasBonus(category: Rating) {
  return category.startsWith("Damage");
}

function chartData() {
  return {
    labels: [...selectedCategories],
    datasets: [...selectedWeapons].map((w) => {
      return {
        label: w,
        data: [...selectedCategories].map((c) => {
          const baseRating = NORMALIZED_RATINGS.get(w)!.get(c)!;
          if (hasBonus(c)) {
            return bonusMult(w, selectedTarget) * baseRating;
          } else {
            return baseRating;
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
    scales: {
      radial: {
        min: 0,
        max: 1,
      },
    },
  },
  data: chartData(),
});

function redraw() {
  chart.data = chartData();
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
Object.values(Weapon).map((w) => {
  const div = document.createElement("div");
  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.margin = "0.5em";

  const input = document.createElement("input");
  input.id = w;
  input.checked = selectedWeapons.has(w);
  input.setAttribute("type", "checkbox");
  input.onclick = (ev) => {
    const enabled = (ev.target as HTMLInputElement).checked;
    setWeapon(w, enabled);
  };
  div.appendChild(input);

  const label = document.createElement("label");
  label.htmlFor = w;
  label.innerText = w;
  label.style.padding = "0.2em";
  // label.style.border = `3px ${weaponDash(w)} ${weaponColor(w)}`;
  div.appendChild(label);

  weapons.appendChild(div);
});

function setCategory(category: Rating, enabled: boolean) {
  if (enabled) {
    selectedCategories.add(category);
  } else {
    selectedCategories.delete(category);
  }
  redraw();
}

// Write all categories we know about into the categories list
const categories = document.getElementById("categories") as HTMLFieldSetElement;
Object.values(Rating).map((r) => {
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
