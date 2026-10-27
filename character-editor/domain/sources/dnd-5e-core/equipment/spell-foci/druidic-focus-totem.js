
export class DruidicFocusTotem {

    static get name() {
        return "druidic-focus-totem";
    }

    static get title() {
        return "Druidic focus, totem";
    }

    static get category() {
        return "spell-foci";
    }

    static get properties() {
        return [
            { name: "arcane-focus-title", value: DruidicFocusTotem.title },
            { name: "spell-classes", value: "druid, ranger" }
        ];
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
