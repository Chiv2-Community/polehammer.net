import LONGSWOARD from "./weapons/longsword";
import RAPIER from "./weapons/rapier";

export enum Weapon {
  RAPIER = "Rapier",
  LONGSWORD = "Longsword",
}

export const Ratings = new Map([
  [Weapon.RAPIER, RAPIER],
  [Weapon.LONGSWORD, LONGSWOARD],
]);
