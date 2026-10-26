
export class MagicWeapon {

    static get name() {
        return "magic-weapon";
    }

    static get title() {
        return "Magic Weapon";
    }

    static get category() {
        return "weapons-magical";
    }

    static get properties() {
        return [];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex) {
        const item = character.equipment[inventoryIndex];
        let selectedWeapon = null;
        const selectedValues = item.selections.find(s => s.name == "weapon")?.values ?? []; 
        if (selectedValues.length > 0) {
            selectedWeapon = MagicWeapon.#weapons.find(w => w.name == selectedValues[0].value);
        }
        if (selectedWeapon) {
            item.properties = [];
            item.properties.push({ name: "weapon-name", value: selectedWeapon.name });
            item.properties.push({ name: "weapon-type", value: selectedWeapon.weaponType });
            if (selectedWeapon.versatileDamageDice) {
                item.properties.push({ name: "versatile" });
            }
            if (selectedWeapon.isLoading) {
                item.properties.push({ name: "loading" });
            }
            if (selectedWeapon.ammunition) {
                item.properties.push({ name: "ammunition" });
            }
            if (selectedWeapon.isLight) {
                item.properties.push({ name: "light" });
            }
            if (selectedWeapon.isLoading) {
                item.properties.push({ name: "loading" });
            }
            if (selectedWeapon.isTwoHanded) {
                item.properties.push({ name: "two-handed" });
            }
            if (selectedWeapon.isHeavy) {
                item.properties.push({ name: "heavy" });
            }
            if (selectedWeapon.isFinesse) {
                item.properties.push({ name: "finesse" });
            }
            if (selectedWeapon.isThrown) {
                item.properties.push({ name: "thrown" });
            }
            if (selectedWeapon.isReach) {
                item.properties.push({ name: "reach" });
            }
            if (selectedWeapon.isSpecial) {
                item.properties.push({ name: "special" });
            }
        }
        item.isEquipped = true;
    }

    static get html() {
        return "";
    }

    static getSelections(character, inventoryIndex) {
        const selections = [];
        const item = character.equipment[inventoryIndex];
        selections.push(character.selectionUtilities.getSelection(item.selections, `weapon`, "Weapon", 1, [{ name: "weapons" }]));
        selections.push(character.selectionUtilities.getSelection(item.selections, `bonus`, "Bonus", 1));
        return selections;
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        let options = [];
        const item = character.equipment[inventoryIndex];
        if (selectionName == "weapon") {
            const weapons = [...sources.find(s => s.name == "weapons").options];
            const selectedValues = item.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.selectionUtilities.getSelectionOptions(
                weapons, selectedValues, [], "Weapon (choose 1) ...");
        }
        if (selectionName == "bonus") {
            const bonuses = [
                { name: "plus-one-bonus", title: "+1" },
                { name: "plus-two-bonus", title: "+2" },
                { name: "plus-three-bonus", title: "+3" }
            ];
            const selectedValues = item.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.selectionUtilities.getSelectionOptions(
                bonuses, selectedValues, [], "Bonus (choose 1) ...");
        }
        return options;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const item = character.equipment[inventoryIndex];
        if (item.isEquipped) {

            let weaponName = null;
            const selectedValues = item.selections.find(s => s.name == "weapon")?.values ?? [];
            if (selectedValues.length > 0) {
                weaponName = MagicWeapon.#weapons.find(w => w.name == selectedValues[0].value)?.name;
            }

            let bonus = 0;
            const selectedBonuses = item.selections.find(s => s.name == "bonus")?.values ?? [];
            if (selectedBonuses.length > 0 && selectedBonuses[0].value) {
                bonus = Number(selectedBonuses[0].text);
            }

            if (weaponName) {
                const name = `magic-${weaponName}-bonus-${bonus}`;
                modifiers.push({
                    name: `${name}-to-hit-modifier`,
                    target: "to-hit",
                    value: bonus,
                    title: MagicWeapon.title,
                    conditions: [
                        {
                            name: "equipment-index",
                            values: [inventoryIndex]
                        }
                    ]
                });
                modifiers.push({
                    name: `${name}-damage-modifier`,
                    target: "damage",
                    value: bonus,
                    title: MagicWeapon.title,
                    conditions: [
                        {
                            name: "equipment-index",
                            values: [inventoryIndex]
                        }
                    ]
                });
            }
 
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = MagicWeapon.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            const item = character.equipment[inventoryIndex];
            let selectedWeapon = null;
            const selectedValues = item.selections.find(s => s.name == "weapon")?.values ?? [];
            if (selectedValues.length > 0) {
                selectedWeapon = MagicWeapon.#weapons.find(w => w.name == selectedValues[0].value);
            }
            if (selectedWeapon) {
                let bonusLabel = "";
                let bonusValue = 0;
                const selectedBonuses = item.selections.find(s => s.name == "bonus")?.values ?? [];
                if (selectedBonuses.length > 0 && selectedBonuses[0].value) {
                    bonusLabel = selectedBonuses[0].text;
                    bonusValue = Number(selectedBonuses[0].text);
                }
                const attackCard = character.getAttackCard({
                    name: `magic-${selectedWeapon.name}-plus-${bonusValue}`,
                    title: `${bonusLabel} ${selectedWeapon.title}`.trim(),
                    inventoryIndex: inventoryIndex,
                    damageDice: selectedWeapon.damageDice,
                    damageType: selectedWeapon.damageType
                });
                tempFeatures.push(attackCard);
            }
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = MagicWeapon.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #weapons = [
        {
            name: "battleaxe",
            title: "Battleaxe", 
            weaponType: "martial-melee",
            damageDice: [{ number: 1, size: 8 }],
            damageType: "slashing",
            versatileDamageDice: [{ number: 1, size: 10 }]
        },
        {
            name: "blowgun",
            title: "Blowgun",
            weaponType: "martial-ranged",
            damageDice: [{ number: 1, size: 1 }],
            damageType: "piercing",
            range: "25/100",
            isLoading: true,
            ammunition: true
        },
        {
            name: "club",
            title: "Club",
            weaponType: "simple-melee",
            damageDice: [{ number: 1, size: 4 }],
            damageType: "bludgeoning",
            isLight: true
        },
        {
            name: "crossbow-hand",
            title: "Crossbow, hand",
            weaponType: "martial-ranged",
            damageDice: [{ number: 1, size: 6 }],
            damageType: "piercing",
            isLight: true,
            range: "30/120",
            isLoading: true,
            ammunition: true
        },
        {
            name: "crossbow-heavy",
            title: "Crossbow, heavy",
            weaponType: "martial-ranged",
            damageDice: [{ number: 1, size: 10 }],
            damageType: "piercing",
            range: "100/400",
            isTwoHanded: true,
            isLoading: true,
            ammunition: true,
            isHeavy: true
        },
        {
            name: "crossbow-light",
            title: "Crossbow, light",
            weaponType: "simple-ranged",
            damageDice: [{ number: 1, size: 8 }],
            damageType: "piercing",
            range: "80/320",
            isTwoHanded: true,
            isLoading: true,
            ammunition: true
        },
        {
            name: "dagger",
            title: "Dagger",
            weaponType: "simple-melee",
            damageDice: [{ number: 1, size: 4 }],
            damageType: "piercing",
            isLight: true,
            isFinesse: true,
            isThrown: true,
            range: "20/60"
        },
        {
            name: "dart",
            title: "Dart",
            weaponType: "simple-ranged",
            damageDice: [{ number: 1, size: 4 }],
            damageType: "piercing",
            isFinesse: true,
            isThrown: true,
            range: "20/60"
        },
        {
            name: "flail",
            title: "Flail",
            weaponType: "martial-melee",
            damageDice: [{ number: 1, size: 8 }],
            damageType: "bludgeoning"
        },
        {
            name: "glaive",
            title: "Glaive",
            weaponType: "martial-melee",
            damageDice: [{ number: 1, size: 10 }],
            damageType: "slashing",
            isTwoHanded: true,
            isHeavy: true,
            isReach: true
        },
        {
            name: "greataxe",
            title: "Greataxe",
            weaponType: "martial-melee",
            damageDice: [{ number: 1, size: 12 }],
            damageType: "slashing",
            isTwoHanded: true,
            isHeavy: true
        },
        {
            name: "greatclub",
            title: "Greatclub",
            weaponType: "simple-melee",
            damageDice: [{ number: 1, size: 8 }],
            damageType: "bludgeoning",
            isTwoHanded: true
        },
        {
            name: "greatsword",
            title: "Greatsword",
            weaponType: "martial-melee",
            damageDice: [{ number: 2, size: 6 }],
            damageType: "slashing",
            isTwoHanded: true,
            isHeavy: true
        },
        {
            name: "halberd",
            title: "Halberd",
            weaponType: "martial-melee",
            damageDice: [{ number: 1, size: 10 }],
            damageType: "slashing",
            isTwoHanded: true,
            isHeavy: true,
            isReach: true
        },
        {
            name: "handaxe",
            title: "Handaxe",
            weaponType: "simple-melee",
            damageDice: [{ number: 1, size: 6 }],
            damageType: "slashing",
            isLight: true,
            isThrown: true,
            range: "20/60"
        },
        {
            name: "javelin",
            title: "Javelin",
            weaponType: "simple-melee",
            damageDice: [{ number: 1, size: 6 }],
            damageType: "piercing",
            isThrown: true,
            range: "30/120"
        },
        {
            name: "lance",
            title: "Lance",
            weaponType: "martial-melee",
            damageDice: [{ number: 1, size: 12 }],
            damageType: "piercing",
            isReach: true,
            isSpecial: true
        },
        {
            name: "light-hammer",
            title: "Light hammer",
            weaponType: "simple-melee",
            damageDice: [{ number: 1, size: 4 }],
            damageType: "bludgeoning",
            isLight: true,
            isThrown: true,
            range: "20/60"
        },
        {
            name: "longbow",
            title: "Longbow",
            weaponType: "martial-ranged",
            damageDice: [{ number: 1, size: 8 }],
            damageType: "piercing",
            range: "150/600",
            isTwoHanded: true,
            ammunition: true,
            isHeavy: true
        },
        {
            name: "longsword",
            title: "Longsword",
            weaponType: "martial-melee",
            damageDice: [{ number: 1, size: 8 }],
            damageType: "slashing",
            versatileDamageDice: [{ number: 1, size: 10 }]
        },
        {
            name: "mace",
            title: "Mace",
            weaponType: "simple-melee",
            damageDice: [{ number: 1, size: 6 }],
            damageType: "bludgeoning"
        },
        {
            name: "maul",
            title: "Maul",
            weaponType: "martial-melee",
            damageDice: [{ number: 2, size: 6 }],
            damageType: "bludgeoning",
            isTwoHanded: true,
            isHeavy: true
        },
        {
            name: "morningstar",
            title: "Morningstar",
            weaponType: "martial-melee",
            damageDice: [{ number: 1, size: 8 }],
            damageType: "piercing"
        },
        {
            name: "net",
            title: "Net",
            weaponType: "martial-ranged",
            isThrown: true,
            range: "5/15",
            isSpecial: true
        },
        {
            name: "pike",
            title: "Pike",
            weaponType: "martial-melee",
            damageDice: [{ number: 1, size: 10 }],
            damageType: "piercing",
            isTwoHanded: true,
            isHeavy: true,
            isReach: true
        },
        {
            name: "quarterstaff",
            title: "Quarterstaff",
            weaponType: "simple-melee",
            damageDice: [{ number: 1, size: 6 }],
            damageType: "bludgeoning",
            versatileDamageDice: [{ number: 1, size: 8 }]
        },
        {
            name: "rapier",
            title: "Rapier",
            weaponType: "martial-melee",
            damageDice: [{ number: 1, size: 8 }],
            damageType: "piercing",
            isFinesse: true
        },
        {
            name: "scimitar",
            title: "Scimitar",
            weaponType: "martial-melee",
            damageDice: [{ number: 1, size: 6 }],
            damageType: "slashing",
            isLight: true,
            isFinesse: true
        },
        {
            name: "shortbow",
            title: "Shortbow",
            weaponType: "simple-ranged",
            damageDice: [{ number: 1, size: 6 }],
            damageType: "piercing",
            range: "80/320",
            isTwoHanded: true,
            ammunition: true
        },
        {
            name: "shortsword",
            title: "Shortsword",
            weaponType: "martial-melee",
            damageDice: [{ number: 1, size: 6 }],
            damageType: "piercing",
            isLight: true,
            isFinesse: true
        },
        {
            name: "sickle",
            title: "Sickle",
            weaponType: "simple-melee",
            damageDice: [{ number: 1, size: 4 }],
            damageType: "slashing",
            isLight: true
        },
        {
            name: "sling",
            title: "Sling",
            weaponType: "simple-ranged",
            damageDice: [{ number: 1, size: 4 }],
            damageType: "bludgeoning",
            range: "30/120",
            ammunition: true
        },
        {
            name: "spear",
            title: "Spear",
            weaponType: "simple-melee",
            damageDice: [{ number: 1, size: 6 }],
            damageType: "piercing",
            versatileDamageDice: [{ number: 1, size: 8 }],
            isThrown: true,
            range: "20/60"
        },
        {
            name: "trident",
            title: "Trident",
            weaponType: "martial-melee",
            damageDice: [{ number: 1, size: 6 }],
            damageType: "piercing",
            versatileDamageDice: [{ number: 1, size: 8 }],
            isThrown: true,
            range: "20/60"
        },
        {
            name: "war-pick",
            title: "War pick",
            weaponType: "martial-melee",
            damageDice: [{ number: 1, size: 8 }],
            damageType: "piercing"
        },
        {
            name: "warhammer",
            title: "Warhammer",
            weaponType: "martial-melee",
            damageDice: [{ number: 1, size: 8 }],
            damageType: "bludgeoning",
            versatileDamageDice: [{ number: 1, size: 10 }]
        },
        {
            name: "whip",
            title: "Whip",
            weaponType: "martial-melee",
            damageDice: [{ number: 1, size: 4 }],
            damageType: "slashing",
            isFinesse: true,
            isReach: true
        }
    ]

}
