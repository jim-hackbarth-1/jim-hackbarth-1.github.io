
export class PanFlute {

    static get name() {
        return "pan-flute";
    }

    static get title() {
        return "Pan flute";
    }

    static get category() {
        return "tools";
    }

    static get properties() {
        return [
            { name: "arcane-focus-title", value: PanFlute.title + " (spell focus)" },
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
