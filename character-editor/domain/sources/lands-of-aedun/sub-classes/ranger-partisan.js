
export class RangerPartisan {

    static get name() {
        return "ranger-partisan";
    }

    static get title() {
        return "Partisan";
    }

    static get htmlPath() {
        return "lands-of-aedun/sub-classes/ranger-partisan.html";
    }

    static get className() {
        return "ranger";
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

    static getSpellCastingInfo(character, allSpells, classSpellCastingInfo) {
        return classSpellCastingInfo;
    }

}
