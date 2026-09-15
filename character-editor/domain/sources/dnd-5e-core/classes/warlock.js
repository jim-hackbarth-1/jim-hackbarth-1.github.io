
export class Warlock {

    static get name() {
        return "warlock";
    }

    static get title() {
        return "Warlock";
    }

    static get htmlPath() {
        return "dnd-5e-core/classes/warlock.html";
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
        return "Otherworldly Patron";
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
