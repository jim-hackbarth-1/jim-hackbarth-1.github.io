
export class Fighter {

    static get name() {
        return "fighter";
    }

    static get title() {
        return "Fighter";
    }

    static get htmlPath() {
        return "dnd-5e-core/classes/fighter.html";
    }

    static getMulticlassEligibility(character) {
        if (
            Number(character.abilityScores.strength) >= 13
            || Number(character.abilityScores.dexterity) >= 13
        ) {
            return {
                isEligible: isEligible,
                ineligibilityReason: null
            };
        }
        return {
            isEligible: false,
            ineligibilityReason: "Strength or Dexterity >= 13 required"
        };
    }

    static get subClassTitle() {
        return "Martial Archetype";
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
