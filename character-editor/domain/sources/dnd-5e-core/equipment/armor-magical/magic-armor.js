
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class MagicArmor {

    static get name() { return "magic-armor"; }
    static get title() { return "Magic Armor"; }
    static get category() { return "armor-magical"; }
    static get canBeEquipped() { return true; }
    static get html() { return ""; }

    static get properties() {
        return [
            { name: "is-armor" },
        ];

    }
    static get displayProperties() {
        return ["Rare, Very rare, or Legendary"];

    }

    static getSelections(character, inventoryIndex) {
        const selections = [];
        const item = character.equipment[inventoryIndex];
        selections.push(character.getSelection(item.selections, `armor`, "Armor", 1, [{ name: "armor" }]));
        selections.push(character.getSelection(item.selections, `bonus`, "Bonus", 1));
        return selections;
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        let options = [];
        const item = character.equipment[inventoryIndex];
        if (selectionName == "armor") {
            let armor = [...sources.find(s => s.name == "armor").options];
            armor = armor.filter(a => !a.properties.some(p => p.name == "armor-name" && p.value == "shield"));
            const selectedValues = item.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.getSelectionOptions(
                armor, selectedValues, [], "Armor (choose 1) ...");
        }
        if (selectionName == "bonus") {
            const bonuses = [
                { name: "plus-one-bonus", title: "+1" },
                { name: "plus-two-bonus", title: "+2" },
                { name: "plus-three-bonus", title: "+3" }
            ];
            const selectedValues = item.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.getSelectionOptions(
                bonuses, selectedValues, [], "Bonus (choose 1) ...");
        }
        return options;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        let selectedArmor = null;
        const selectedValues = item.selections.find(s => s.name == "armor")?.values ?? [];
        if (selectedValues.length > 0) {
            selectedArmor = allEquipment.find(ae => ae.name == selectedValues[0].value);
        }
        item.properties = [];
        if (selectedArmor) {
            item.properties = [...selectedArmor.properties];
        }
        else {
            item.properties = MagicArmor.properties;
        }

        let bonusLabel = "";
        const selectedBonuses = item.selections.find(s => s.name == "bonus")?.values ?? [];
        if (selectedBonuses.length > 0 && selectedBonuses[0].value) {
            bonusLabel = selectedBonuses[0].text;
        }
        const armorTitle = item.properties.find(p => p.name == "armor-title")?.value ?? MagicArmor.title;
        item.properties.push({ name: "title", value: `${bonusLabel} ${armorTitle}`.trim() });

        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const item = character.equipment[inventoryIndex];
        if (item.isEquipped) {

            let armorName = null;
            const selectedValues = item.selections.find(s => s.name == "armor")?.values ?? [];
            if (selectedValues.length > 0) {
                armorName = selectedValues[0].value;
            }

            let bonus = 0;
            const selectedBonuses = item.selections.find(s => s.name == "bonus")?.values ?? [];
            if (selectedBonuses.length > 0 && selectedBonuses[0].value) {
                bonus = Number(selectedBonuses[0].text);
            }

            if (armorName) {
                const name = `magic-${armorName}-bonus-${bonus}`;
                let acModifier = item.properties.find(p => p.name == "ac-modifier")?.value ?? 0;
                acModifier = Number(acModifier) + bonus;

                modifiers.push({
                    name: `${name}-inventory-index-${inventoryIndex}-ac-modifier`,
                    target: "armor-class",
                    value: acModifier,
                    title: MagicArmor.title
                });

                if (item.properties.some(p => p.name == "strength")) {
                    const strength = character.getAbilityScore("strength");
                    if (Number(strength) < 15) {
                        modifiers.push({
                            name: `${name}-inventory-index-${inventoryIndex}-speed-modifier`,
                            target: "speed",
                            value: -10,
                            title: MagicArmor.title
                        });
                    }
                }
            }

        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = MagicArmor.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {

    }

    static applySpells(spells, character, inventoryIndex) {

    }
}
