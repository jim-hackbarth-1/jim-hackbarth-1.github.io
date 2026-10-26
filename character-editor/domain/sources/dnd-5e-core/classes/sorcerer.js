
export class Sorcerer {

    static get name() {
        return "sorcerer";
    }

    static get title() {
        return "Sorcerer";
    }

    static get htmlPath() {
        return "dnd-5e-core/classes/sorcerer.html";
    }

    static get hitDieSize() {
        return 6;
    }

    static getMulticlassEligibility(character) {
        const charisma = Number(character.getAbilityScore("charisma"));
        if (charisma >= 13) {
            return {
                isEligible: true,
                ineligibilityReason: null
            };
        }
        return {
            isEligible: false,
            ineligibilityReason: "Charisma >= 13 required"
        };
    }

    static get subClassTitle() {
        return "Sorcerous Origin";
    }

    static get subClassLevel() {
        return 1;
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

    static getSpellCastingInfo(character, allSpells) {
        return null;
    }

}
