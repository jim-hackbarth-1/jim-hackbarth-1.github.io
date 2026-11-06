
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Shawm {

    static get name() { return "shawm"; }
    static get title() { return "Shawm"; }
    static get category() { return "tools"; }
    static get canBeEquipped() { return true; }
    static get html() { return ""; }

    static get properties() {
        return [
            { name: "arcane-focus-title", value: Shawm.title + " (spell focus)" },
            { name: "spell-classes", value: "bard" },
            { name: "musical-instrument" }
        ];
    }

    static get displayProperties() { return ["Cost: 2gp"]; }

    static getSelections(character, inventoryIndex) {
        return [];
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = Shawm.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {

    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
