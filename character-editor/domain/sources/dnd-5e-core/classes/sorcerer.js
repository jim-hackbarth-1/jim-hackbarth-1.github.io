
export class Sorcerer {

    static get name() {
        return "sorcerer";
    }

    static get title() {
        return "Sorcerer";
    }

    static get htmlPath() {
        return "dnd-5e-core/classes/sorcerer.html";
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
        return "Sorcerous Origin";
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
