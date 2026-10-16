
export class Human {

    static get name() {
        return "human";
    }

    static get title() {
        return "Human";
    }

    static get htmlPath() {
        return "dnd-5e-core/races/human.html";
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

    static applyAbilityScoreModifiers(character) {

    }

    static applyModifiers(character) {

    }

    static applyFeatures(features, character) {

    }

    static applySpells(spells, character) {

    }

}
