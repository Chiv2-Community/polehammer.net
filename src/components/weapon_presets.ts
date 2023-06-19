import ALL_WEAPONS from '../all_weapons';
import { Weapon, WeaponType } from '../weapon';

const WEAPON_PRESETS = new Map<WeaponType, Weapon[]>();

Object.values(WeaponType).forEach(wt => {
  let presetValues = ALL_WEAPONS.filter(w => w.weaponTypes.includes(wt))
  WEAPON_PRESETS.set(wt, presetValues)
});

export default WEAPON_PRESETS;
