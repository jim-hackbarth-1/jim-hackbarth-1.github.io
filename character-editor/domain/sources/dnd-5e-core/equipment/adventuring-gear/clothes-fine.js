
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ClothesFine {

    static get name() { return "clothes-fine"; }
    static get title() { return "Clothes, fine"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return false; }
    static get html() { return ""; }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 15gp"];
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
