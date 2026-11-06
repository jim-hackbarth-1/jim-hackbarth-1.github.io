
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class GamingSetThreeDragonAnte {

    static get name() { return "gaming-set-three-dragon-ante"; }
    static get title() { return "Gaming Set, Three Dragon Ante"; }
    static get category() { return "tools"; }
    static get canBeEquipped() { return false; }
    static get html() { return ""; }
    static get properties() { return [{ name: "gaming-set" }]; }
    static get displayProperties() { return ["Cost: 1gp"]; }

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
