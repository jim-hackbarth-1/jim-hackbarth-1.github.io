
export class Viol {

    static get name() {
        return "viol";
    }

    static get title() {
        return "Viol";
    }

    static get category() {
        return "tools";
    }

    static get properties() {
        return [
            { name: "arcane-focus-title", value: Viol.title + " (spell focus)" },
            { name: "spell-classes", value: "bard" },
            { name: "musical-instrument" }
        ];
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
