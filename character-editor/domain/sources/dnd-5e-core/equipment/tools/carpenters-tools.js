
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class CarpentersTools {

    static get name() { return "carpenters-tools"; }
    static get title() { return "Carpenter's tools"; }
    static get category() { return "tools"; }
    static get canBeEquipped() { return false; }
    static get html() { return ""; }
    static get properties() { return [{ name: "artisans-tools" }]; }
    static get displayProperties() { return ["Cost: 8gp"]; }

    static getSelections(character, inventoryIndex) {
        return [];
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {

    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
