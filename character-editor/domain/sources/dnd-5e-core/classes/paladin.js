
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

    static getMulticlassEligibility(character) {
        if (
            Number(character.abilityScores.strength) >= 13
            && Number(character.abilityScores.charisma) >= 13
        ) {
            return {
                isEligible: isEligible,
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
