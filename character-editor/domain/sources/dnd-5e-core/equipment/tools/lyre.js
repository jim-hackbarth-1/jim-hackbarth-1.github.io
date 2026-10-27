
export class Lyre {

    static get name() {
        return "lyre";
    }

    static get title() {
        return "Lyre";
    }

    static get category() {
        return "tools";
    }

    static get properties() {
        return [
            { name: "arcane-focus-title", value: Lyre.title + " (spell focus)" },
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
