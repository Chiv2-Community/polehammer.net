let weaponPresetsBuilder = new Map<string, Weapon[]>()

Object.values(WeaponType).forEach(wt => {
  let presetValues = ALL_WEAPONS.filter(w => w.weaponTypes.includes(wt))
  weaponPresets.set(wt, presetValues)
});

export const weaponPresets = weaponPresetsBuilder
