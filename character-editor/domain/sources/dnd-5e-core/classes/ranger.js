
export class Ranger {

    static get name() {
        return "ranger";
    }

    static get title() {
        return "Ranger";
    }

    static get htmlPath() {
        return "dnd-5e-core/classes/ranger.html";
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
        return "Ranger Archetyp";
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
