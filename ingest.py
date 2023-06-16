import json
import re
import sys
import os
import copy
import csv
from collections.abc import Mapping
import argparse

#VALID_STATS = ["Holding", "Windup", "Release", "Recovery", "Combo", "Riposte", "Damage", "TurnLimitStrength", "VerticalTurnLimitStrength", "ReverseTurnLimitStrength"]
VALID_ATTACKS = ["slash", "slashHeavy", "overhead","overheadHeavy", "stab", "stabHeavy", "throw", "special", "sprintAttack", "sprintCharge"]

MATCHUP_STAT_WEIGHTS = {
    "windup": -0.25, 
    "release": 0.25, 
    "recovery": -0.25, 
    "combo": -0.25, 

    "damage": 1, 

    "range": 1, 
    "altRange": 1 
}


MATCHUP_ATTACK_WEIGHTS = {
    "average": 0,
    "slash": 1,
    "overhead": 1,
    "stab": 1,
    "special": 0,
    "sprintAttack": 0,
    "sprintCharge": 0,
    "throw": 0,
}

HEAVY_WEIGHT = 1
LIGHT_WEIGHT = 1

def seconds_to_millis(n):
    return n * 1000 if n != -1 else -1

STAT_TRANSFORMS = {
    "windup": seconds_to_millis,
    "release": seconds_to_millis,
    "recovery": seconds_to_millis,
    "combo": seconds_to_millis,
    "holding": seconds_to_millis,
}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-i", "--input_json", required=True, help="Path to the input JSON file")
    parser.add_argument("-o", "--output_dir", required=True, help="Path to the output directory")
    parser.add_argument("-c", "--changelog_location", required=True, help="Path to output the changelog json")
    args = parser.parse_args()

    base_defaults = {}
    attack_defaults = {}
    weapon_defaults = {}
    weapons = {}

    data = fetch_data(args.input_json)["Rows"]

    for name, item in data.items():
        process_item(name, item, base_defaults, attack_defaults, weapon_defaults, weapons)

    apply_defaults(weapons, attack_defaults)

    write_to_file(list(weapons.values()), args.output_dir, args.changelog_location)

def lowercase_first_char(in_str):
    return in_str[0].lower() + in_str[1:]

def fetch_data(path):
    with open(path) as user_file:
      return json.load(user_file)

def clean_item(item):#, VALID_STATS):
    return {lowercase_first_char(key): item[key] for key in item.keys()}#VALID_STATS}

def process_item(name, item, base_defaults, attack_defaults, weapon_defaults, weapons):
    name_parts = name.split('.')
    item = clean_item(item)#, VALID_STATS)
    attack_type = lowercase_first_char(name_parts[1]) if len(name_parts) > 1 else None

    if attack_type and attack_type not in VALID_ATTACKS: 
        return

    if name_parts[0] == 'Default':
        process_default_item(name_parts, attack_type, item, base_defaults, attack_defaults)
    else:
        process_weapon_item(name_parts, attack_type, item, weapon_defaults, weapons)

def process_default_item(name_parts, attack_type, item, base_defaults, attack_defaults):
    if len(name_parts) == 1:
        base_defaults = item
    else:
        attack_defaults = process_attack(attack_type, item, attack_defaults)

def process_weapon_item(name_parts, attack_type, item, weapon_defaults, weapons):
    if len(name_parts) == 1:
        weapon_defaults[name_parts[0]] = item
    else:
        weapon_name = name_parts[0].replace("Weapon_", "")
        if weapon_name not in weapons:
            weapons[weapon_name] = {"name": weapon_name, "attacks": {}}
        weapons[weapon_name]["attacks"] = process_attack(attack_type, item, weapons[weapon_name]["attacks"])

def process_attack(attack_type, item, attacks):
    if "Heavy" in attack_type:
        attack_type = attack_type.replace("Heavy", "")
        if attack_type not in attacks:
            attacks[attack_type] = {"light": {}, "heavy": {}}
        attacks[attack_type]["heavy"] = apply_stat_transforms(item)
    elif attack_type in ["slash", "overhead", "stab"]:
        if attack_type not in attacks:
            attacks[attack_type] = {"light": {}, "heavy": {}}
        attacks[attack_type]["light"] = apply_stat_transforms(item)
    else:
        if attack_type not in attacks:
            attacks[attack_type] = {}
        attacks[attack_type] = apply_stat_transforms(item)
    return attacks

def calculate_matchups(weapons):
    weapons = list(filter(lambda w : "id" in w, weapons))
    weapons = calculate_damage_output(weapons)
    matchups = []
    for weapon in weapons:
        current_matchups = {}
        current_matchups["name"] = weapon["name"]
        for other_weapon in weapons:
            current_matchups[other_weapon["name"]] = calculate_matchup(weapon, other_weapon)

        matchup_numbers = [v for k, v in current_matchups.items() if type(v) in [int, float]]

        current_matchups["winning_matchups"] = len([v for v in matchup_numbers if v > 0.01])
        current_matchups["losing_matchups"] = len([v for v in matchup_numbers if v < -0.01])
        current_matchups["tied_matchups"] = len(weapons) - current_matchups["winning_matchups"] - current_matchups["losing_matchups"]
        current_matchups["average_matchup"] = sum(matchup_numbers) / len(matchup_numbers);

        matchups.append(current_matchups)
    
    matchups.sort(key=lambda x: x["average_matchup"], reverse=True)
    return matchups

def calculate_matchup(weapon, other_weapon):
    matchup = 0
    print("Comparing " + weapon["name"] + " to " + other_weapon["name"])
    for attack_name, attack in weapon["attacks"].items():
        if attack_name not in VALID_ATTACKS:
            continue 

        other_attack = other_weapon["attacks"][attack_name]
        matchup += calculate_matchup_stats(attack_name, attack, other_attack)
    return matchup

def calculate_matchup_stats(attack_name, source_weapon_attack, other_weapon_attack):
    if attack_name not in VALID_ATTACKS or MATCHUP_ATTACK_WEIGHTS[attack_name] == 0:
        return 0

    matchup = 0

    attack_weight = MATCHUP_ATTACK_WEIGHTS[attack_name]

    if attack_name in ["slash", "overhead", "stab", "average"]:
        matchup += calculate_matchup_winner(
            attack_weight * MATCHUP_STAT_WEIGHTS["range"], 
            source_weapon_attack["range"], 
            other_weapon_attack["range"]
        ) 
        
        matchup += calculate_matchup_winner(
            attack_weight * MATCHUP_STAT_WEIGHTS["altRange"], 
            source_weapon_attack["altRange"], 
            other_weapon_attack["altRange"]
        )
        
        for stat, value in source_weapon_attack["light"].items():
            if stat not in MATCHUP_STAT_WEIGHTS:
                continue

            other_value = other_weapon_attack["light"][stat]
            weight = attack_weight * MATCHUP_STAT_WEIGHTS[stat] * LIGHT_WEIGHT
            matchup += calculate_matchup_winner(weight, value, other_value)

        for stat, value in source_weapon_attack["heavy"].items():
            if stat not in MATCHUP_STAT_WEIGHTS:
                continue
            
            print(stat + ": " + str(value) + " vs " + str(other_weapon_attack["heavy"][stat]))
            other_value = other_weapon_attack["heavy"][stat]
            weight = attack_weight * MATCHUP_STAT_WEIGHTS[stat] * HEAVY_WEIGHT
            matchup += calculate_matchup_winner(weight, value, other_value)

    else:
        for stat, value in source_weapon_attack.items():
            if stat not in MATCHUP_STAT_WEIGHTS:
                continue

            other_value = other_weapon_attack[stat]
            weight = attack_weight * MATCHUP_STAT_WEIGHTS[stat]
            matchup += calculate_matchup_winner(weight, value, other_value)

    return matchup

def calculate_matchup_winner(weight, a, b):
    if a > b:
        return weight
    elif a < b:
        return -weight
    else:
        return 0

def make_averages(weapon):
    if "slash" not in weapon["attacks"]:
        return 

    ignore_keys = ["cleaveOverride", "damageTypeOverride"]
    has_range = "range" in weapon["attacks"]["slash"]

    average_attack = {"light": {}, "heavy": {}}
    sums = {"light": {}, "heavy": {}, "range": 0, "altRange": 0}
    for attack in ["slash", "overhead", "stab"]:
        currentRangeSum = sums["range"]
        currentAltRangeSum = sums["altRange"]

        # heavy and light attacks have the same keys
        for stat in weapon["attacks"][attack]["light"].keys():
            if stat in ignore_keys:
                continue 

            lightStatValue = weapon["attacks"][attack]["light"][stat]
            heavyStatValue = weapon["attacks"][attack]["heavy"][stat]

            if type(lightStatValue) not in [float, int]:
                try:
                    float(lightStatValue)
                except: 
                    print(f"WARNING: {stat} has type {type(lightStatValue)}, with value {lightStatValue}")
                    continue
                continue

            currentLightSum = sums["light"][stat] if stat in sums["light"] else 0
            currentHeavySum = sums["heavy"][stat] if stat in sums["heavy"] else 0
            sums["light"][stat] = currentLightSum + lightStatValue
            sums["heavy"][stat] = currentHeavySum + heavyStatValue
        
        if has_range:
            sums["range"] = currentRangeSum + weapon["attacks"][attack]["range"]
            sums["altRange"] = currentAltRangeSum + weapon["attacks"][attack]["altRange"]
        
    for stat in sums["light"].keys():
        if stat in ignore_keys:
            continue 

        average_attack["light"][stat] = sums["light"][stat] / 3
        average_attack["heavy"][stat] = sums["heavy"][stat] / 3

    if has_range:
        average_attack["range"] = sums["range"] / 3
        average_attack["altRange"] = sums["altRange"] / 3

    weapon["attacks"]["average"] = average_attack
    

def apply_defaults(weapons, attack_defaults):
    for weapon, weapon_data in weapons.items():
        for attack, attack_data in weapon_data["attacks"].items():
            if attack in ["slash", "overhead", "stab"]:
                for attack_subtype, item in attack_data.items():
                    for key in item.keys():
                        if item[key] == -1:
                            item[key] = attack_defaults[attack][attack_subtype][key]
            else:
                for key in attack_data.keys():
                    if attack_data[key] == -1:
                        if key in attack_defaults.get(attack, {}):
                            attack_data[key] = attack_defaults[attack][key]

def write_to_file(data, foldername, changelog_location):
    try:
        if not os.path.exists(foldername):
            os.mkdir(foldername)

        changelog = {}
        merged_weapons = []
        for weapon in data:
            path = foldername + "/" + pascal_to_camel(weapon["name"]) + ".json"
            weapon["name"] = pascal_to_space(weapon["name"])
            exists = os.path.isfile(path)
            existing_data = {}
            if exists:
                existing_data = fetch_data(path)

            with open(path, 'w') as outfile:
                (changes, merged) = deep_merge(weapon["name"], existing_data, weapon)
                make_averages(merged)
                if len(changes) > 0:
                    changelog[weapon["name"]] = changes
                merged["name"] = pascal_to_space(weapon["name"])
                merged_weapons.append(merged)
                json.dump(merged, outfile, indent=2)

        for (name, changes) in changelog.items():
            for change in changes:
                full_path = name + "." + '.'.join(change['path'])
                print(full_path + ": " + str(change['old']) + " -> " + str(change['new']))
        
        write_dicts_to_csv(data, foldername + "/data.csv")

        matchups = calculate_matchups(merged_weapons)

        write_dicts_to_csv(matchups, foldername + "matchups.csv", ["name"] + list(map(lambda r: r["name"], matchups)) + ["average_matchup", "winning_matchups", "losing_matchups", "tied_matchups"])

        with open(changelog_location, 'w') as changelog_file: 
            json.dump(changelog, changelog_file, indent=2)
    except IOError as e:
        print(e)
        sys.exit("Unable to write to JSON file!")

import csv

def flatten_dict(d, parent_key='', sep='_'):
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)

def write_dicts_to_csv(data, csv_file_path, keys = None):
    with open(csv_file_path, 'w', newline='') as f:
        writer = None
        for d in data:
            flat_d = flatten_dict(d)
            if writer is None:
                if keys is None:
                    keys = flat_d.keys()
                writer = csv.DictWriter(f, fieldnames=keys)
                writer.writeheader()
            writer.writerow(flat_d)



def pascal_to_camel(s):
    return re.sub(r'(?<!^)(?=[A-Z])', '_', s).lower()

def pascal_to_space(s):
    return re.sub(r'(?<!^)(?=[A-Z])', ' ', s).replace("  ", " ")

def apply_stat_transforms(data):
    for key, value in data.items():
        if key in STAT_TRANSFORMS:
            data[key] = STAT_TRANSFORMS[key](value)

    return data

def deep_merge(name, dict1, dict2, path=None):
    "Deeply merge two dictionaries and print out the differences."

    changes = []

    if path is None: 
        path = []

    for key in dict2:
        value = dict2[key]
        if key in dict1:
            if isinstance(dict1[key], Mapping) and isinstance(value, Mapping):
                (new_changes, _) = deep_merge(name, dict1[key], value, path + [str(key)])
                changes += new_changes
            else: 
                if dict1[key] == value:
                    pass # same leaf value
                else:
                    changes.append({'path': path + [key], 'old': dict1[key], 'new': value})
                    dict1[key] = value
        else:
            changes.append({'path': path + [key], 'old': None, 'new': value})
            dict1[key] = value
    return (changes, dict1)

def calculate_damage_output(weapons):
    updated_weapons = []
    for weapon in weapons:
        damage_type = weapon["damageType"]
        damage_multiplier = 1
        if damage_type == "Blunt":
            damage_multiplier = 1.2125 # (1 + 1 +1.35 + 1.5) / 4
        elif damage_type == "Slash":
            damage_multiplier = 1.10625

        for attack_name, attack in weapon["attacks"].items():
            if attack_name in ["slash", "overhead", "stab", "average"]:
                print(attack_name)
                attack["light"]["damage"] = attack["light"]["damage"] * damage_multiplier
                attack["heavy"]["damage"] = attack["heavy"]["damage"] * damage_multiplier
            else:
                attack["damage"] = attack["damage"] * damage_multiplier

            weapon[attack_name] = attack
        updated_weapons.append(weapon)

    return updated_weapons

if __name__ == '__main__':
    main()
