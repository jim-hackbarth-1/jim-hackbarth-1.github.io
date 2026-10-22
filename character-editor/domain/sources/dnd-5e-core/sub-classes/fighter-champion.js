
export class FighterChampion {

    static get name() {
        return "fighter-champion";
    }

    static get title() {
        return "Champion";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/fighter-champion.html";
    }

    static get className() {
        return "fighter";
    }

    static getSelections(character, classIndex) {
        return [];
    }

    static getSelectionOptions(character, classIndex, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, classIndex, targetFilters) {

    }

    static applyFeatures(features, character, classIndex) {

    }

    static applySpells(spells, character, classIndex) {

    }
}
