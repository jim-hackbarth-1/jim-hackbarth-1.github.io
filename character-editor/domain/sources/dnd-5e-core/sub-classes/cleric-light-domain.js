
export class ClericLightDomain {

    static get name() {
        return "cleric-light-domain";
    }

    static get title() {
        return "Light Domain";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/cleric-light-domain.html";
    }

    static get className() {
        return "cleric";
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
