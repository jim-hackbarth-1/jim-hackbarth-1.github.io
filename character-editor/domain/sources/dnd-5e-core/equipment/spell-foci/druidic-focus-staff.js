
export class DruidicFocusStaff {

    static get name() {
        return "druidic-focus-staff";
    }

    static get title() {
        return "Druidic focus, staff";
    }

    static get category() {
        return "spell-foci";
    }

    static get properties() {
        return [
            { name: "arcane-focus-title", value: DruidicFocusStaff.title },
            { name: "spell-classes", value: "druid, ranger" }
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
