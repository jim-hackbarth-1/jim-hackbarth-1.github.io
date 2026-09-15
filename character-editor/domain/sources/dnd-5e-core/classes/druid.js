
export class Druid {

    static get name() {
        return "druid";
    }

    static get title() {
        return "Druid";
    }

    static get htmlPath() {
        return "dnd-5e-core/classes/druid.html";
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
        return "Druid Circle";
    }

    static get subClassLevel() {
        return 2;
    }

    static getOptions(character) {
        return [];
    }

    static updateFeatures(character) {

    }

}
