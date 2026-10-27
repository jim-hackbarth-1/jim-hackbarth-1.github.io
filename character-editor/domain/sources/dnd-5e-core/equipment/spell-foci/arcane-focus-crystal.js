
export class ArcaneFocusCrystal {

    static get name() {
        return "arcane-focus-crystal";
    }

    static get title() {
        return "Arcane focus, crystal";
    }

    static get category() {
        return "spell-foci";
    }

    static get properties() {
        return [
            { name: "arcane-focus-title", value: ArcaneFocusCrystal.title },
            { name: "spell-classes", value: "sorcerer, warlock, wizard" }
        ];
    }

    static get displayProperties() {
        return ["Cost: 10gp"];
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
