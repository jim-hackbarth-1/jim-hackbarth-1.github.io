
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
