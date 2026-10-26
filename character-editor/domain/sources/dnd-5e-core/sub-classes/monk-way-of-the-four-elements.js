
export class MonkWayOfTheFourElements {

    static get name() {
        return "monk-way-of-the-four-elements";
    }

    static get title() {
        return "Way of the Four Elements";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/monk-way-of-the-four-elements.html";
    }

    static get className() {
        return "monk";
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
