
export class Monk {

    static get name() {
        return "monk";
    }

    static get title() {
        return "Monk";
    }

    static get htmlPath() {
        return "dnd-5e-core/classes/monk.html";
    }

    static getMulticlassEligibility(character) {
        if (
            Number(character.abilityScores.dexterity) >= 13
            && Number(character.abilityScores.wisdom) >= 13
        ) {
            return {
                isEligible: isEligible,
                ineligibilityReason: null
            };
        }
        return {
            isEligible: false,
            ineligibilityReason: "Dexterity and Wisdom >= 13 required"
        };
    }

    static get subClassTitle() {
        return "Monastic Tradition";
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
