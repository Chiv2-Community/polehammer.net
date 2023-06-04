import json
import re
import sys
import requests
import os
import copy
from collections.abc import Mapping
import argparse



def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-i", "--input_json", required=True, help="Path to the input JSON file")
    parser.add_argument("-o", "--output_dir", required=True, help="Path to the output directory")
    parser.add_argument("-c", "--changelog_location", required=True, help="Path to the changelog location")
    args = parser.parse_args()

    valid_stats = ["Holding", "Windup", "Release", "Recovery", "Combo", "Riposte", "Damage", "TurnLimitStrength", "VerticalTurnLimitStrength", "ReverseTurnLimitStrength"]
    valid_attacks = ["slash", "slashHeavy", "overhead","overheadHeavy", "stab", "stabHeavy", "jab", "shove", "kickLow", "throw"]

    base_defaults = {}
    attack_defaults = {}
    weapon_defaults = {}
    weapons = {}

    data = fetch_data(args.input_json)["Rows"]

    for name, item in data.items():
        process_item(name, item, valid_stats, valid_attacks, base_defaults, attack_defaults, weapon_defaults, weapons)

    apply_defaults(weapons, attack_defaults)

    write_to_file(list(weapons.values()), args.output_dir, args.changelog_location)

def lowercase_first_char(in_str):
    return in_str[0].lower() + in_str[1:]

def fetch_data(path):
    with open(path) as user_file:
      return json.load(user_file)

def clean_item(item, valid_stats):
    return {lowercase_first_char(key): item[key] for key in valid_stats}

def process_item(name, item, valid_stats, valid_attacks, base_defaults, attack_defaults, weapon_defaults, weapons):
    name_parts = name.split('.')
    item = clean_item(item, valid_stats)
    attack_type = lowercase_first_char(name_parts[1]) if len(name_parts) > 1 else None

    if attack_type and attack_type not in valid_attacks: 
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
        attacks[attack_type]["heavy"] = item
    elif attack_type in ["slash", "overhead", "stab"]:
        if attack_type not in attacks:
            attacks[attack_type] = {"light": {}}
        attacks[attack_type]["light"] = item
    else:
        if attack_type not in attacks:
            attacks[attack_type] = {}
        attacks[attack_type] = item
    return attacks

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
        for weapon in data:
            path = foldername + "/" + pascal_to_camel(weapon["name"]) + ".json"
            exists = os.path.isfile(path)
            existing_data = {}
            if exists:
                existing_data = fetch_data(path)

            print(existing_data)

            with open(path, 'w') as outfile:
                (changes, merged) = deep_merge(weapon["name"], existing_data, weapon)
                if len(changes) > 0:
                    changelog[weapon["name"]] = changes
                json.dump(merged, outfile, indent=2)

        for (name, changes) in changelog.items():
            for change in changes:
                full_path = name + "." + '.'.join(change['path'])
                print(full_path + ": " + str(change['old']) + " -> " + str(change['new']))

        with open(changelog_location, 'w') as changelog_file:
            json.dump(changelog, changelog_file, indent=2)
    except IOError as e:
        print(e)
        sys.exit("Unable to write to JSON file!")


def pascal_to_camel(s):
    return re.sub(r'(?<!^)(?=[A-Z])', '_', s).lower()

def deep_merge(name, dict1, dict2, path=None):
    "Deeply merge two dictionaries and print out the differences."

    changes = []

    if path is None: 
        path = []

    for key in dict2:
        if key in dict1:
            if isinstance(dict1[key], Mapping) and isinstance(dict2[key], Mapping):
                (new_changes, _) = deep_merge(name, dict1[key], dict2[key], path + [str(key)])
                changes += new_changes
            elif dict1[key] == dict2[key]:
                pass # same leaf value
            else:
                changes.append({'path': path + [key], 'old': dict1[key], 'new': dict2[key]})
                dict1[key] = dict2[key]
        else:
            changes.append({'path': path + [key], 'old': None, 'new': dict2[key]})
            dict1[key] = dict2[key]
    return (changes, dict1)

if __name__ == '__main__':
    main()
