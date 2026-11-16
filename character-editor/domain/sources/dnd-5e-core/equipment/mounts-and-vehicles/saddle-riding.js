
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class SaddleRiding {

    static get name() { return "saddle-riding"; }
    static get title() { return "Saddle, riding"; }
    static get category() { return "mounts-and-vehicles"; }
    static get canBeEquipped() { return false; }
    static get html() { return ""; }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 5gp"];
    }

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
