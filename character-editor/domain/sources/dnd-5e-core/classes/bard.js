
export class Bard {

    static get name() {
        return "bard";
    }

    static get title() {
        return "Bard";
    }

    static get htmlPath() {
        return "dnd-5e-core/classes/bard.html";
    }

    static getMulticlassEligibility(character) {
        if (Number(character.abilityScores.charisma) >= 13) {
            return {
                isEligible: isEligible,
                ineligibilityReason: null
            };
        }
        return {
            isEligible: false,
            ineligibilityReason: "Charisma >= 13 required"
        };
    }

    static get subClassTitle() {
        return "Bard College";
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
