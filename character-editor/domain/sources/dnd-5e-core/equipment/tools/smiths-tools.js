
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class SmithsTools {

    static get name() { return "smiths-tools"; }
    static get title() { return "Smith's Tools"; }
    static get category() { return "tools"; }
    static get canBeEquipped() { return false; }
    static get html() { return ""; }
    static get properties() { return [{ name: "artisans-tools" }]; }
    static get displayProperties() { return ["Cost: 20gp"]; }

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
