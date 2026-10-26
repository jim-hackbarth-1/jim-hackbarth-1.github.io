
export class Abacus {

    static get name() {
        return "abacus";
    }

    static get title() {
        return "Abacus";
    }

    static get category() {
        return "adventuring-gear";
    }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 2gp"];
    }

    static get canBeEquipped() {
        return false;
    }

    static get html() {
        return "";
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
