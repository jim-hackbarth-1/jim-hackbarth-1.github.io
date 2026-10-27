
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

    static get displayProperties() {
        return [];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        let selectedFocus = null;
        const selectedValues = item.selections.find(s => s.name == "spell-focus")?.values ?? [];
        if (selectedValues.length > 0) {
            selectedFocus = allEquipment.find(ae => ae.name == selectedValues[0].value);
        }
        item.properties = [];
        if (selectedFocus) {
            item.properties = [...selectedFocus.properties];
        }

        let bonusLabel = "";
        const selectedBonuses = item.selections.find(s => s.name == "bonus")?.values ?? [];
        if (selectedBonuses.length > 0 && selectedBonuses[0].value) {
            bonusLabel = selectedBonuses[0].text;
        }
        const arcaneFocusTitle = item.properties.find(p => p.name == "arcane-focus-title")?.value ?? MagicSpellFocus.title;
        item.properties.push({ name: "title", value: `${bonusLabel} ${arcaneFocusTitle}`.trim() });

        item.isEquipped = true;
    }

    static get html() {
        return "";
    }

    static getSelections(character, inventoryIndex) {
        const selections = [];
        const item = character.equipment[inventoryIndex];
        selections.push(character.selectionUtilities.getSelection(
            item.selections, `spell-focus`, "Spell Focus", 1, [{ name: "spell-foci" }, { name: "tools" }]));
        selections.push(character.selectionUtilities.getSelection(item.selections, `bonus`, "Bonus", 1));
        return selections;
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        let options = [];
        const item = character.equipment[inventoryIndex];
        if (selectionName == "spell-focus") {
            const spellFoci = [...sources.find(s => s.name == "spell-foci").options];
            const tools = [...sources.find(s => s.name == "tools").options];
            for (const tool of tools) {
                if (tool.properties.some(p => p.name == "musical-instrument")) {
                    spellFoci.push(tool);
                }
            }
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
        const item = character.equipment[inventoryIndex];
        if (item.isEquipped) {

            let spellFocus = null;
            const selectedValues = item.selections.find(s => s.name == "spell-focus")?.values ?? [];
            if (selectedValues.length > 0) {
                spellFocus = selectedValues[0].value;
            }

            let bonus = 0;
            const selectedBonuses = item.selections.find(s => s.name == "bonus")?.values ?? [];
            if (selectedBonuses.length > 0 && selectedBonuses[0].value) {
                bonus = Number(selectedBonuses[0].text);
            }

            if (spellFocus) {
                const name = `magic-${spellFocus}-bonus-${bonus}`;
                const spellClassesSerial = item.properties.find(p => p.name == "spell-classes")?.value ?? "";
                const spellClasses = spellClassesSerial.split(",").map(sc => sc.trim());
                modifiers.push({
                    name: `${name}-dc-modifier`,
                    target: "dc",
                    value: bonus,
                    title: MagicSpellFocus.title,
                    conditions: [
                        {
                            name: "spell-class",
                            values: spellClasses
                        }
                    ]
                });
                modifiers.push({
                    name: `${name}-to-hit-modifier`,
                    target: "to-hit",
                    value: bonus,
                    title: MagicSpellFocus.title,
                    conditions: [
                        {
                            name: "spell-class",
                            values: spellClasses
                        }
                    ]
                });
                modifiers.push({
                    name: `${name}-damage-modifier`,
                    target: "damage",
                    value: bonus,
                    title: MagicSpellFocus.title,
                    conditions: [
                        {
                            name: "spell-class",
                            values: spellClasses
                        }
                    ]
                });
            }

        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = MagicSpellFocus.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {
        
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
