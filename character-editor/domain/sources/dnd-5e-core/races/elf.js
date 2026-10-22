
export class Elf {

    static get name() {
        return "elf";
    }

    static get title() {
        return "Elf";
    }

    static get htmlPath() {
        return "dnd-5e-core/races/elf.html";
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

    static applyModifiers(character, targetFilters) {

    }

    static applyFeatures(features, character) {

    }

    static applySpells(spells, character) {

    }

}
