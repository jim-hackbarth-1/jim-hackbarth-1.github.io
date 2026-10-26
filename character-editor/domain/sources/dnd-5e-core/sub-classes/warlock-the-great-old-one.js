
export class WarlockTheGreatOldOne {

    static get name() {
        return "warlock-the-great-old-one";
    }

    static get title() {
        return "The Great Old One";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/warlock-the-great-old-one.html";
    }

    static get className() {
        return "warlock";
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
