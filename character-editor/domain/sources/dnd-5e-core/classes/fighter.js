
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

    static get hitDieSize() {
        return 10;
    }

    static getMulticlassEligibility(character) {
        const strength = Number(character.getAbilityScore("strength"));
        const dexterity = Number(character.getAbilityScore("dexterity"));
        if (strength >= 13 || dexterity >= 13) {
            return {
                isEligible: true,
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
