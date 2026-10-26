
export class Flute {

    static get name() {
        return "flute";
    }

    static get title() {
        return "Flute";
    }

    static get category() {
        return "tools";
    }

    static get properties() {
        return ["musical-instrument"];
    }

    static get displayProperties() {
        return [];
    }

    static get canBeEquipped() {
        return true;
    }

    static get html() {
        return ``;
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
