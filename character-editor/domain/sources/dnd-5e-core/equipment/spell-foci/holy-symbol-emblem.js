
export class HolySymbolEmblem {

    static get name() {
        return "holy-symbol-emblem";
    }

    static get title() {
        return "Holy symbol, emblem";
    }

    static get category() {
        return "spell-foci";
    }

    static get properties() {
        return [
            { name: "arcane-focus-title", value: HolySymbolEmblem.title },
            { name: "spell-classes", value: "cleric, paladin" }
        ];
    }

    static get displayProperties() {
        return ["Cost: 5gp"];
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
