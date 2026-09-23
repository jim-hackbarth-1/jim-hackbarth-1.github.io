
export class Paladin {

    static get name() {
        return "paladin";
    }

    static get title() {
        return "Paladin";
    }

    static get htmlPath() {
        return "dnd-5e-core/classes/paladin.html";
    }

    static get hitDieSize() {
        return 10;
    }

    static getMulticlassEligibility(character) {
        const strength = Number(character.getAbilityScore("strength"));
        const charisma = Number(character.getAbilityScore("charisma"));
        if (strength >= 13 && charisma >= 13) {
            return {
                isEligible: true,
                ineligibilityReason: null
            };
        }
        return {
            isEligible: false,
            ineligibilityReason: "Strength and Charisma >= 13 required"
        };
    }

    static get subClassTitle() {
        return "Sacred Oath";
    }

    static get subClassLevel() {
        return 3;
    }

    static getOptions(character) {
        return [];
    }

    static updateFeatures(character) {

    }

}
