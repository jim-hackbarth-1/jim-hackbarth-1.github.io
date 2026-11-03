
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class BrewersTools {

    static get name() { return "brewers-tools"; }
    static get title() { return "Brewer's tools"; }
    static get category() { return "tools"; }
    static get canBeEquipped() { return false; }
    static get html() { return ""; }

    static get properties() {
        return [{ name: "artisans-tools" }];
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

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {

    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
