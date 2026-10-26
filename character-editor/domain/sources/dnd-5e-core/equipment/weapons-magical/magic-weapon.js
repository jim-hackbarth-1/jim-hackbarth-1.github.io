
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
    static get displayProperties() {
        return [];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        let selectedWeapon = null;
        const selectedValues = item.selections.find(s => s.name == "weapon")?.values ?? []; 
        if (selectedValues.length > 0) {
            selectedWeapon = allEquipment.find(ae => ae.name == selectedValues[0].value);
        }
        item.properties = [];
        if (selectedWeapon) {
            item.properties = [...selectedWeapon.properties];
        }
        let bonus = 0;
        let bonusLabel = "";
        const selectedBonuses = item.selections.find(s => s.name == "bonus")?.values ?? [];
        if (selectedBonuses.length > 0 && selectedBonuses[0].value) {
            bonus = Number(selectedBonuses[0].text);
            bonusLabel = selectedBonuses[0].text;
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
                weaponName = selectedValues[0].value;
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
                selectedWeapon = selectedValues[0].value;
            }
            if (selectedWeapon) {
                let bonusLabel = "";
                let bonusValue = 0;
                const selectedBonuses = item.selections.find(s => s.name == "bonus")?.values ?? [];
                if (selectedBonuses.length > 0 && selectedBonuses[0].value) {
                    bonusLabel = selectedBonuses[0].text;
                    bonusValue = Number(selectedBonuses[0].text);
                }
                const weaponTitle = item.properties.find(p => p.name == "weapon-title")?.value ?? MagicWeapon.title;
                const damageDice = [];
                const damageDiceSerial = item.properties.find(p => p.name == "damage-dice")?.value ?? "";
                const damageDiceSerialArray = damageDiceSerial.split(","); 
                for (const item of damageDiceSerialArray) {
                    const parts = item.split("d");
                    if (parts.length == 2) {
                        damageDice.push({ number: Number(parts[0]), size: Number(parts[1]) });
                    }
                }
                const damageType = item.properties.find(p => p.name == "damage-type")?.value ?? "";
                const attackCard = character.getAttackCard({
                    name: `magic-${selectedWeapon}-plus-${bonusValue}`,
                    title: `${bonusLabel} ${weaponTitle}`.trim(),
                    inventoryIndex: inventoryIndex,
                    damageDice: damageDice,
                    damageType: damageType
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
}
