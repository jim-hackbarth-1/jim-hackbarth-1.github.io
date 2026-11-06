
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class TinkersTools {

    static get name() { return "tinkers-tools"; }
    static get title() { return "Tinker's Tools"; }
    static get category() { return "tools"; }
    static get canBeEquipped() { return false; }
    static get html() { return ""; }
    static get properties() { return [{ name: "artisans-tools" }]; }
    static get displayProperties() { return ["Cost: 50gp"]; }

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
