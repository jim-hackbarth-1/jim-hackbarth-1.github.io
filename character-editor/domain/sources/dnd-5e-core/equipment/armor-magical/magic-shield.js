
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class MagicShield {

    static get name() { return "magic-shield"; }
    static get title() { return "Magic Shield"; }
    static get category() { return "armor-magical"; }
    static get canBeEquipped() { return true; }
    static get html() { return ""; }

    static get properties() {
        return [
            { name: "is-shield" },
            { name: "armor-name", value: "shield" },
            { name: "armor-title", value: MagicShield.title },
            { name: "armor-type", value: "shield" }
        ];

    }
    static get displayProperties() {
        return ["Uncommon, Rare, Very rare"];

    }

    static getSelections(character, inventoryIndex) {
        const selections = [];
        const item = character.equipment[inventoryIndex];
        selections.push(character.getSelection(item.selections, `bonus`, "Bonus", 1));
        return selections;
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        let options = [];
        const item = character.equipment[inventoryIndex];
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
        item.properties = [...MagicShield.properties];

        let bonusLabel = "";
        const selectedBonuses = item.selections.find(s => s.name == "bonus")?.values ?? [];
        if (selectedBonuses.length > 0 && selectedBonuses[0].value) {
            bonusLabel = selectedBonuses[0].text;
        }
        item.properties.push({ name: "title", value: `${bonusLabel} Shield`.trim() });
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const item = character.equipment[inventoryIndex];
        if (item.isEquipped) {

            let bonus = 0;
            const selectedBonuses = item.selections.find(s => s.name == "bonus")?.values ?? [];
            if (selectedBonuses.length > 0 && selectedBonuses[0].value) {
                bonus = Number(selectedBonuses[0].text);
            }

            modifiers.push({
                name: `${MagicShield.name}-inventory-index-${inventoryIndex}-ac-modifier`,
                target: "armor-class",
                value: 2 + bonus,
                title: MagicShield.title
            });

        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = MagicShield.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {

    }

    static applySpells(spells, character, inventoryIndex) {

    }
}
