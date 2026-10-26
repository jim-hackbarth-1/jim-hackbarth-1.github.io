
export class Totem {

    static get name() {
        return "totem";
    }

    static get title() {
        return "Totem";
    }

    static get category() {
        return "spell-foci";
    }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 1gp"];
    }

    static get canBeEquipped() {
        return true;
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
