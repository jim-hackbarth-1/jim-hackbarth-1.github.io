
export class Tiefling {

    static get name() {
        return "tiefling";
    }

    static get title() {
        return "Tiefling";
    }

    static get htmlPath() {
        return "dnd-5e-core/races/tiefling.html";
    }

    static get speed() {
        return 30;
    }

    static get size() {
        return "medium";
    }

    static getSelections(character) {
        return [];
    }

    static getSelectionOptions(character, selectionName, sources) {
        return [];
    }

    static applyModifiers(character) {

    }

    static applyFeatures(features, character) {

    }

    static applySpells(spells, character) {

    }

}
