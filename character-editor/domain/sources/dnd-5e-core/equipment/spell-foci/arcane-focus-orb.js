
export class ArcaneFocusOrb {

    static get name() {
        return "arcane-focus-orb";
    }

    static get title() {
        return "Arcane focus, orb";
    }

    static get category() {
        return "spell-foci";
    }

    static get properties() {
        return [
            { name: "arcane-focus-title", value: ArcaneFocusOrb.title },
            { name: "spell-classes", value: "sorcerer, warlock, wizard" }
        ];
    }

    static get displayProperties() {
        return ["Cost: 20gp"];
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
