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
import CAVALRY_SWORD from "./weapons/heavy_cavalry_sword.json"
import HIGHLAND_SWORD from "./weapons/highland_sword.json";
import JAVELIN from "./weapons/javelin.json";
import KATARS from "./weapons/katars.json"
import KNIFE from "./weapons/knife.json";
import LONGSWORD from "./weapons/longsword.json";
import MACE from "./weapons/mace.json";
import MALLET from "./weapons/throwing_mallet.json";
import MAUL from "./weapons/maul.json";
import MESSER from "./weapons/messer.json";
import MORNING_STAR from "./weapons/morning_star.json";
import ONE_HANDED_SPEAR from "./weapons/one_handed_spear.json";
import PICKAXE from "./weapons/pickaxe.json";
import POLEAXE from "./weapons/pole_axe.json";
import POLEHAMMER from "./weapons/polehammer.json";
import QUARTERSTAFF from "./weapons/quarterstaff.json"
import RAPIER from "./weapons/rapier.json";
import SHORT_SWORD from "./weapons/short_sword.json";
import SHOVEL from "./weapons/shovel.json";
import SLEDGEHAMMER from "./weapons/sledgehammer.json";
import SWORD from "./weapons/sword.json";
import THROWING_AXE from "./weapons/throwing_axe.json";
import TWO_HANDED_HAMMER from "./weapons/two_handed_hammer.json";
import SPEAR from "./weapons/spear.json";
import WAR_AXE from "./weapons/war_axe.json";
import WAR_CLUB from "./weapons/war_club.json";
import WARHAMMER from "./weapons/warhammer.json";
import { Weapon } from "./weapon";

const ALL_WEAPONS: Weapon[] = [
  AXE,
  BATTLE_AXE,
  CUDGEL,
  CAVALRY_SWORD, 
  DAGGER,
  DANE_AXE,
  EXECUTIONERS_AXE,
  FALCHION,
  GLAIVE,
  GREATSWORD,
  HALBERD,
  HATCHET,
  HEAVY_MACE,
  HIGHLAND_SWORD,
  JAVELIN,
  KATARS, 
  KNIFE,
  LONGSWORD,
  MACE,
  MALLET,
  MAUL,
  MESSER,
  MORNING_STAR,
  ONE_HANDED_SPEAR,
  PICKAXE,
  POLEAXE,
  POLEHAMMER,
  QUARTERSTAFF, 
  RAPIER,
  SHORT_SWORD,
  SHOVEL,
  SLEDGEHAMMER,
  SWORD,
  THROWING_AXE,
  TWO_HANDED_HAMMER,
  SPEAR,
  WAR_AXE,
  WAR_CLUB,
  WARHAMMER,
].map((w) => w as Weapon);

export function weaponByName(name: string) {
  return ALL_WEAPONS.find((w) => w.name === name);
}

export function weaponById(id: string) {
  return ALL_WEAPONS.find((w) => w.id === id);
}

export default ALL_WEAPONS;
