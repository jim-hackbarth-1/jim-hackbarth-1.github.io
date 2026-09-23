
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

    static get hitDieSize() {
        return 8;
    }

    static getMulticlassEligibility(character) {
        const wisdom = Number(character.getAbilityScore("wisdom"));
        if (wisdom >= 13) {
            return {
                isEligible: true,
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
