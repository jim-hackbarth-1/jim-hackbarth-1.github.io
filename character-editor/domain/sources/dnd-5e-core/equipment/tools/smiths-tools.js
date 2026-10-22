
export class SmithsTools {

    static get name() {
        return "smiths-tools";
    }

    static get title() {
        return "Smith's tools";
    }

    static get category() {
        return "tools";
    }

    static get properties() {
        return ["artisans-tools"];
    }

    static get canBeEquipped() {
        return false;
    }

    static get html() {
        return `
        `;
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
