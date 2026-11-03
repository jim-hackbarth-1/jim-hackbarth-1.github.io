
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class PanFlute {

    static get name() { return "pan-flute"; }
    static get title() { return "Pan flute"; }
    static get category() { return "tools"; }
    static get canBeEquipped() { return true; }
    static get html() { return ""; }

    static get properties() {
        return [
            { name: "arcane-focus-title", value: PanFlute.title + " (spell focus)" },
            { name: "spell-classes", value: "bard" },
            { name: "musical-instrument" }
        ];
    }

    static get displayProperties() {
        return [];
    }

    static getSelections(character, inventoryIndex) {
        return [];
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = PanFlute.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {

    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
