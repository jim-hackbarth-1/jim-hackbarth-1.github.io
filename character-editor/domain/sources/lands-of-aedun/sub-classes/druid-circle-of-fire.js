
export class DruidCircleOfFire {

    static get name() {
        return "druid-circle-of-fire";
    }

    static get title() {
        return "Circle of Fire";
    }

    static get htmlPath() {
        return "lands-of-aedun/sub-classes/druid-circle-of-fire.html";
    }

    static get className() {
        return "druid";
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
