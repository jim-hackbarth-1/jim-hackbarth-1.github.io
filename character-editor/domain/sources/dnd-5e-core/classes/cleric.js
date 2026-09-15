
export class Cleric {

    static get name() {
        return "cleric";
    }

    static get title() {
        return "Cleric";
    }

    static get htmlPath() {
        return "dnd-5e-core/classes/cleric.html";
    }

    static getMulticlassEligibility(character) {
        if (Number(character.abilityScores.wisdom) >= 13) {
            return {
                isEligible: isEligible,
                ineligibilityReason: null
            };
        }
        return {
            isEligible: false,
            ineligibilityReason: "Wisdom >= 13 required"
        };
    }

    static get subClassTitle() {
        return "Divine Domain";
    }

    static get subClassLevel() {
        return 1;
    }

    static getOptions(character) {
        return [];
    }

    static updateFeatures(character) {

    }

}
