
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
