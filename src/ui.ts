import { ALL_WEAPONS } from "chivalry2-weapons";
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

export function weaponColor(weaponName: string, opacity: number): string {
  const idx = ALL_WEAPONS.findIndex(w => w.name == weaponName);
  return `hsl(${
    PALETTE_DEGS[idx % PALETTE_DEGS.length]
  }deg, ${SATURATION}, ${LIGHTNESS}, ${opacity})`;
}

export function metricColor(value: number | undefined, range: {min: number; max: number}, invert: boolean): string {
  if(value == -1 || value == 0 || value == undefined)
    return `hsl(300, ${SATURATION}, ${LIGHTNESS}, ${0.5})`;

  if(range.min == range.max)
    return `hsl(200, ${SATURATION}, ${LIGHTNESS}, ${0.5})`;

  if(colorBlindMode) {
    var relativeDistance = (value - range.min) / (range.max - range.min);

    if(relativeDistance > 0.5) {
      const weight = (relativeDistance - 0.5) * 2;
      const rgb = mixColors([86, 180, 233], [255, 255, 255], weight)
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
    } else {
      const weight = (0.5 - relativeDistance) * 2;
      const rgb = mixColors([230, 159, 0], [255, 255, 255], weight)
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
    }
  } else {
    let hueOffset = 0;
    let hueRange = 120;

    let size = range.max - range.min

    let relativeValue = value - range.min;
    let maybeInvertedRelativeValue = invert ? size - relativeValue : relativeValue;
    let hue = maybeInvertedRelativeValue/size * hueRange;

    return `hsl(${hue + hueOffset}deg, ${SATURATION}, ${LIGHTNESS}, ${0.5})`;
  }
}

function mixColors(color1: number[], color2: number[], weight: number): number[] {
  var w1 = weight;
  var w2 = 1 - w1;
  var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
      Math.round(color1[1] * w1 + color2[1] * w2),
      Math.round(color1[2] * w1 + color2[2] * w2)];
  return rgb;
}

export function weaponDash(weaponName: string) {
  const idx = ALL_WEAPONS.findIndex(w => w.name === weaponName);
  if (idx >= 2 * PALETTE_SIZE) {
    return "dotted";
  } else if (idx >= PALETTE_SIZE) {
    return "dashed";
  } else {
    return "solid";
  }
}

export function borderDash(weaponName: string) {
  switch (weaponDash(weaponName)) {
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