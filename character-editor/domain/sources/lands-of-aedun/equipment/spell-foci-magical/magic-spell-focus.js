
export class MagicSpellFocus {

    static get name() {
        return "magic-spell-focus";
    }

    static get title() {
        return "Magic Spell Focus";
    }

    static get category() {
        return "spell-foci-magical";
    }

    static get properties() {
        return [];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex) {
        // const item = character.equipment[inventoryIndex];
        // let selectedWeapon = null;
        // const selectedValues = item.selections.find(s => s.name == "weapon")?.values ?? [];
        // if (selectedValues.length > 0) {
        //     selectedWeapon = MagicWeapon.#weapons.find(w => w.name == selectedValues[0].value);
        // }
        // if (selectedWeapon) {
        //     item.properties = [];
        //     item.properties.push({ name: "weapon-name", value: selectedWeapon.name });
        //     item.properties.push({ name: "weapon-type", value: selectedWeapon.weaponType });
        //     if (selectedWeapon.versatileDamageDice) {
        //         item.properties.push({ name: "versatile" });
        //     }
        //     if (selectedWeapon.isLoading) {
        //         item.properties.push({ name: "loading" });
        //     }
        //     if (selectedWeapon.ammunition) {
        //         item.properties.push({ name: "ammunition" });
        //     }
        //     if (selectedWeapon.isLight) {
        //         item.properties.push({ name: "light" });
        //     }
        //     if (selectedWeapon.isLoading) {
        //         item.properties.push({ name: "loading" });
        //     }
        //     if (selectedWeapon.isTwoHanded) {
        //         item.properties.push({ name: "two-handed" });
        //     }
        //     if (selectedWeapon.isHeavy) {
        //         item.properties.push({ name: "heavy" });
        //     }
        //     if (selectedWeapon.isFinesse) {
        //         item.properties.push({ name: "finesse" });
        //     }
        //     if (selectedWeapon.isThrown) {
        //         item.properties.push({ name: "thrown" });
        //     }
        //     if (selectedWeapon.isReach) {
        //         item.properties.push({ name: "reach" });
        //     }
        //     if (selectedWeapon.isSpecial) {
        //         item.properties.push({ name: "special" });
        //     }
        // }
        item.isEquipped = true;
    }

    static get html() {
        return "";
    }

    static getSelections(character, inventoryIndex) {
        const selections = [];
        const item = character.equipment[inventoryIndex];
        selections.push(character.selectionUtilities.getSelection(item.selections, `spell-focus`, "Spell Focus", 1, [{ name: "spell-foci" }]));
        selections.push(character.selectionUtilities.getSelection(item.selections, `bonus`, "Bonus", 1));
        return selections;
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        let options = [];
        const item = character.equipment[inventoryIndex];
        if (selectionName == "spell-foci") {
            const spellFoci = [...sources.find(s => s.name == "spell-foci").options];
            const selectedValues = item.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.selectionUtilities.getSelectionOptions(
                spellFoci, selectedValues, [], "Spell Focus (choose 1) ...");
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
        // const item = character.equipment[inventoryIndex];
        // let bonus = 0;
        // const selectedBonuses = item.selections.find(s => s.name == "bonus")?.values ?? [];
        // if (selectedBonuses.length > 0 && selectedBonuses[0].value) {
        //     bonus = Number(selectedBonuses[0].text);
        // }
        // const isEquipped = character.equipment[inventoryIndex].isEquipped;
        // if (isEquipped) {
        //     modifiers.push({
        //         name: "magic-weapon-to-hit-modifier",
        //         target: "to-hit",
        //         value: bonus,
        //         title: MagicWeapon.title,
        //         conditions: [
        //             {
        //                 name: "equipment-index",
        //                 values: [inventoryIndex]
        //             }
        //         ]
        //     });
        //     modifiers.push({
        //         name: "magic-weapon-damage-modifier",
        //         target: "damage",
        //         value: bonus,
        //         title: MagicWeapon.title,
        //         conditions: [
        //             {
        //                 name: "equipment-index",
        //                 values: [inventoryIndex]
        //             }
        //         ]
        //     });
        // }
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
        // const isEquipped = character.equipment[inventoryIndex].isEquipped;
        // if (isEquipped) {
        //     const item = character.equipment[inventoryIndex];
        //     let selectedWeapon = null;
        //     const selectedValues = item.selections.find(s => s.name == "weapon")?.values ?? [];
        //     if (selectedValues.length > 0) {
        //         selectedWeapon = MagicWeapon.#weapons.find(w => w.name == selectedValues[0].value);
        //     }
        //     if (selectedWeapon) {
        //         let bonus = "";
        //         const selectedBonuses = item.selections.find(s => s.name == "bonus")?.values ?? [];
        //         if (selectedBonuses.length > 0 && selectedBonuses[0].value) {
        //             bonus = selectedBonuses[0].text;
        //         }
        //         const attackCard = character.getAttackCard({
        //             name: selectedWeapon.name,
        //             title: `${bonus} ${selectedWeapon.title}`.trim(),
        //             inventoryIndex: inventoryIndex,
        //             damageDice: selectedWeapon.damageDice,
        //             damageType: selectedWeapon.damageType
        //         });
        //         tempFeatures.push(attackCard);
        //     }
        // }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = MagicWeapon.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #spellFoci = [
        { name: "amulet", title: "Amulet" },
        { name: "crystal", title: "Crystal" },
        { name: "emblem", title: "Emblem" },
        { name: "mistletoe", title: "Mistletoe" },
        { name: "orb", title: "Orb" },
        { name: "reliquary", title: "Reliquary" },
        { name: "rod", title: "Rod" },
        { name: "staff", title: "Staff" },
        { name: "totem", title: "Totem" },
        { name: "wand", title: "Wand" }
    ]

}
