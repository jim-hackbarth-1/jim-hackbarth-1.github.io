
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

    static get hitDieSize() {
        return 8;
    }

    static getMulticlassEligibility(character) {
        const dexterity = Number(character.getAbilityScore("dexterity"));
        if (dexterity >= 13) {
            return {
                isEligible: true,
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
