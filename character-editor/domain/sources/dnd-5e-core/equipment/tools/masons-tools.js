
export class MasonsTools {

    static get name() {
        return "masons-tools";
    }

    static get title() {
        return "Mason's tools";
    }

    static get category() {
        return "tools";
    }

    static get properties() {
        return [{ name: "artisans-tools" }];
    }

    static get displayProperties() {
        return [];
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
