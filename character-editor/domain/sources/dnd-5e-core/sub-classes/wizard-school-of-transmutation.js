
export class WizardSchoolOfTransmutation {

    static get name() {
        return "wizard-school-of-transmutation";
    }

    static get title() {
        return "School of Transmutation";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/wizard-school-of-transmutation.html";
    }

    static get className() {
        return "wizard";
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
