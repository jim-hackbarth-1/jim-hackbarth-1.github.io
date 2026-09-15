
export class Rogue {

    static get name() {
        return "rogue";
    }

    static get title() {
        return "Rogue";
    }

    static get htmlPath() {
        return "dnd-5e-core/classes/rogue.html";
    }

    static getMulticlassEligibility(character) {
        if (Number(character.abilityScores.dexterity) >= 13) {
            return {
                isEligible: isEligible,
                ineligibilityReason: null
            };
        }
        return {
            isEligible: false,
            ineligibilityReason: "Dexterity >= 13 required"
        };
    }

    static get subClassTitle() {
        return "Roguish Archetype";
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
