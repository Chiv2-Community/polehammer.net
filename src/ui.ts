import ALL_WEAPONS from "./all_weapons";
import { Weapon } from "./weapon";
import Cookies from "js-cookie";

let colorBlindModeElem = document.querySelector<HTMLInputElement>("#colorBlindMode")!;
var colorBlindMode = Cookies.get("colorBlindMode") == "true";
colorBlindModeElem.checked = colorBlindMode;

colorBlindModeElem.onchange = () => {
  Cookies.set("colorBlindMode", colorBlindModeElem.checked.toString());
  colorBlindMode = colorBlindModeElem.checked;
}


const SATURATION = "85%";
const LIGHTNESS = "45%";

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

export function weaponColor(weapon: Weapon, opacity: number): string {
  const idx = ALL_WEAPONS.indexOf(weapon);
  return `hsl(${
    PALETTE_DEGS[idx % PALETTE_DEGS.length]
  }deg, ${SATURATION}, ${LIGHTNESS}, ${opacity})`;
}

export function metricColor(value: number, range: {min: number; max: number}): string {
  if(value == -1 || value == 0)
    return `hsl(300, ${SATURATION}, ${LIGHTNESS}, ${0.5})`;

  if(range.min == range.max)
    return `hsl(200, ${SATURATION}, ${LIGHTNESS}, ${0.5})`;
  
  let hueOffset = colorBlindMode ? 41 : 0;
  let hueRange = colorBlindMode ? 161 : 120;

  let size = range.max - range.min
  let relativeValue = value - range.min;
  let hue = relativeValue/size * hueRange;

  return `hsl(${hue + hueOffset}deg, ${SATURATION}, ${LIGHTNESS}, ${0.5})`;
}

export function weaponDash(weapon: Weapon) {
  const idx = ALL_WEAPONS.indexOf(weapon);
  if (idx >= 2 * PALETTE_SIZE) {
    return "dotted";
  } else if (idx >= PALETTE_SIZE) {
    return "dashed";
  } else {
    return "solid";
  }
}

export function borderDash(weapon: Weapon) {
  switch (weaponDash(weapon)) {
    case "solid":
      return undefined;
    case "dashed":
      return [8, 8];
    case "dotted":
      return [2, 2];
  }
}

export function deleteChildren(element: HTMLElement): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}