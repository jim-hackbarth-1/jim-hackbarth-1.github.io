
export class Warlock {

    static get name() {
        return "warlock";
    }

    static get title() {
        return "Warlock";
    }

    static get htmlPath() {
        return "dnd-5e-core/classes/warlock.html";
    }

    static get hitDieSize() {
        return 8;
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
        return "Otherworldly Patron";
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

    static applyAbilityScoreModifiers(character, classIndex) {

    }

    static applyModifiers(character, classIndex) {

    }

    static applyFeatures(features, character, classIndex) {

    }

    static applySpells(spells, character, classIndex) {

    }

}
