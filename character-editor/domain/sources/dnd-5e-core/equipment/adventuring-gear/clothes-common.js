
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ClothesCommon {

    static get name() { return "clothes-common"; }
    static get title() { return "Clothes, common"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return false; } 
    static get html() { return ""; }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 5sp"];
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
