
export class Wizard {

    static get name() {
        return "wizard";
    }

    static get title() {
        return "Wizard";
    }

    static get htmlPath() {
        return "dnd-5e-core/classes/wizard.html";
    }

    static get hitDieSize() {
        return 6;
    }

    static getMulticlassEligibility(character) {
        const intelligence = Number(character.getAbilityScore("intelligence"));
        if (intelligence >= 13) {
            return {
                isEligible: true,
                ineligibilityReason: null
            };
        }
        return {
            isEligible: false,
            ineligibilityReason: "Intelligence >= 13 required"
        };
    }

    static get subClassTitle() {
        return "Arcane Tradition";
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
