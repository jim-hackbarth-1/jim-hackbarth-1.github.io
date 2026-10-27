
export class DruidicFocusMistletoe {

    static get name() {
        return "druidic-focus-mistletoe";
    }

    static get title() {
        return "Druidic focus, mistletoe";
    }

    static get category() {
        return "spell-foci";
    }

    static get properties() {
        return [
            { name: "arcane-focus-title", value: DruidicFocusMistletoe.title },
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
