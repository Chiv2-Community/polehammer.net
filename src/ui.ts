import ALL_WEAPONS from "./all_weapons";
import { Weapon } from "./weapon";

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

export function weaponColor(weapon: Weapon) {
  const idx = ALL_WEAPONS.indexOf(weapon);
  return `hsl(${
    PALETTE_DEGS[idx % PALETTE_DEGS.length]
  }deg, ${SATURATION}, ${LIGHTNESS}, ${OPACITY})`;
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
