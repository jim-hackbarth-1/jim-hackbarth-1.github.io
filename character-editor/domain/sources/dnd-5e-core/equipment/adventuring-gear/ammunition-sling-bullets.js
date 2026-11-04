
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class AmmunitionSlingBullets {

    static get name() { return "ammunition-sling-bullets"; }
    static get title() { return "Ammunition, Sling bullets (20)"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return false; }
    static get html() { return ""; }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 4cp"];
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
