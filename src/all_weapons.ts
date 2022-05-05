import AXE from "./weapons/axe.json";
import BATTLE_AXE from "./weapons/battle_axe.json";
import CUDGEL from "./weapons/cudgel.json";
import DAGGER from "./weapons/dagger.json";
import DANE_AXE from "./weapons/dane_axe.json";
import EXECUTIONERS_AXE from "./weapons/executioners_axe.json";
import FALCHION from "./weapons/falchion.json";
import GLAIVE from "./weapons/glaive.json";
import GREATSWORD from "./weapons/greatsword.json";
import HALBERD from "./weapons/halberd.json";
import HATCHET from "./weapons/hatchet.json";
import HEAVY_MACE from "./weapons/heavy_mace.json";
import HIGHLAND_SWORD from "./weapons/highland_sword.json";
import JAVELIN from "./weapons/javelin.json";
import KNIFE from "./weapons/knife.json";
import LONGSWORD from "./weapons/longsword.json";
import MACE from "./weapons/mace.json";
import MALLET from "./weapons/mallet.json";
import MAUL from "./weapons/maul.json";
import MESSER from "./weapons/messer.json";
import MORNING_STAR from "./weapons/morning_star.json";
import ONE_HANDED_SPEAR from "./weapons/one_handed_spear.json";
import PICKAXE from "./weapons/pickaxe.json";
import POLEAXE from "./weapons/poleaxe.json";
import POLEHAMMER from "./weapons/polehammer.json";
import RAPIER from "./weapons/rapier.json";
import SHORT_SWORD from "./weapons/short_sword.json";
import SHOVEL from "./weapons/shovel.json";
import SLEDGEHAMMER from "./weapons/sledgehammer.json";
import SWORD from "./weapons/sword.json";
import THROWING_AXE from "./weapons/throwing_axe.json";
import TWO_HANDED_HAMMER from "./weapons/two_handed_hammer.json";
import TWO_HANDED_SPEAR from "./weapons/two_handed_spear.json";
import WAR_AXE from "./weapons/war_axe.json";
import WAR_CLUB from "./weapons/war_club.json";
import WARHAMMER from "./weapons/warhammer.json";
import { Weapon } from "./weapon";

function weaponFromJson(obj: unknown): Weapon {
  return Object.setPrototypeOf(obj, Weapon.prototype);
}

const ALL_WEAPONS: Weapon[] = [
  weaponFromJson(AXE),
  weaponFromJson(BATTLE_AXE),
  weaponFromJson(CUDGEL),
  weaponFromJson(DAGGER),
  weaponFromJson(DANE_AXE),
  weaponFromJson(EXECUTIONERS_AXE),
  weaponFromJson(FALCHION),
  weaponFromJson(GLAIVE),
  weaponFromJson(GREATSWORD),
  weaponFromJson(HALBERD),
  weaponFromJson(HATCHET),
  weaponFromJson(HEAVY_MACE),
  weaponFromJson(HIGHLAND_SWORD),
  weaponFromJson(JAVELIN),
  weaponFromJson(KNIFE),
  weaponFromJson(LONGSWORD),
  weaponFromJson(MACE),
  weaponFromJson(MALLET),
  weaponFromJson(MAUL),
  weaponFromJson(MESSER),
  weaponFromJson(MORNING_STAR),
  weaponFromJson(ONE_HANDED_SPEAR),
  weaponFromJson(PICKAXE),
  weaponFromJson(POLEAXE),
  weaponFromJson(POLEHAMMER),
  weaponFromJson(RAPIER),
  weaponFromJson(SHORT_SWORD),
  weaponFromJson(SHOVEL),
  weaponFromJson(SLEDGEHAMMER),
  weaponFromJson(SWORD),
  weaponFromJson(THROWING_AXE),
  weaponFromJson(TWO_HANDED_HAMMER),
  weaponFromJson(TWO_HANDED_SPEAR),
  weaponFromJson(WAR_AXE),
  weaponFromJson(WAR_CLUB),
  weaponFromJson(WARHAMMER),
];

export default ALL_WEAPONS;
