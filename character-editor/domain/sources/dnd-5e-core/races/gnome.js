
export class Gnome {

    static get name() {
        return "gnome";
    }

    static get title() {
        return "Gnome";
    }

    static get htmlPath() {
        return "dnd-5e-core/races/gnome.html";
    }

    static get speed() {
        return 25;
    }

    static get size() {
        return "small";
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
