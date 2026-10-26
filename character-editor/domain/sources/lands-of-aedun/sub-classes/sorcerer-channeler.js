
export class SorcererChanneler {

    static get name() {
        return "sorcerer-channeler";
    }

    static get title() {
        return "Channeler";
    }

    static get htmlPath() {
        return "lands-of-aedun/sub-classes/sorcerer-channeler.html";
    }

    static get className() {
        return "sorcerer";
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
