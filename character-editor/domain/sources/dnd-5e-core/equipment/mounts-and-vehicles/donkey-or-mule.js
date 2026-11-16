
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class DonkeyOrMule {

    static get name() { return "donkey-or-mule"; }
    static get title() { return "Donkey or Mule"; }
    static get category() { return "mounts-and-vehicles"; }
    static get canBeEquipped() { return false; }
    static get html() { return ""; }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 8gp"];
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
