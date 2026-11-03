
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class HolySymbolAmulet {

    static get name() { return "holy-symbol-amulet"; }
    static get title() { return "Holy symbol, amulet"; }
    static get category() { return "spell-foci"; }
    static get canBeEquipped() { return true; }
    static get html() { return ""; }

    static get properties() {
        return [
            { name: "arcane-focus-title", value: HolySymbolAmulet.title },
            { name: "spell-classes", value: "cleric, paladin" }
        ];
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

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = HolySymbolAmulet.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {

    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
