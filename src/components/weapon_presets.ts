import { ALL_WEAPONS, CharacterClass, CharacterSubclass, DamageType, Weapon, WeaponType } from 'chivalry2-weapons';

const WEAPON_PRESETS = new Map<string, Weapon[]>();

Object.values(WeaponType).forEach(wt => {
  let presetValues = ALL_WEAPONS.filter(w => w.weaponTypes.includes(wt))
  WEAPON_PRESETS.set(wt, presetValues)
});

Object.values(CharacterClass).forEach(className => {
  let presetValues = ALL_WEAPONS.filter(w => w.classes.includes(className))
  WEAPON_PRESETS.set(className, presetValues)
});

Object.values(CharacterSubclass).forEach(subclassName => {
  let presetValues = ALL_WEAPONS.filter(w => w.subclasses.includes(subclassName))
  WEAPON_PRESETS.set(subclassName, presetValues)
});

Object.values(DamageType).forEach(damageType => {
  let presetValues = ALL_WEAPONS.filter(w => w.damageType === damageType)
  WEAPON_PRESETS.set(damageType, presetValues)
});

export default WEAPON_PRESETS;
