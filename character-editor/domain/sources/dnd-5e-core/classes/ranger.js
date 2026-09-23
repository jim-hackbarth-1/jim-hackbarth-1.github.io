
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

    static get hitDieSize() {
        return 10;
    }

    static getMulticlassEligibility(character) {
        const dexterity = Number(character.getAbilityScore("dexterity"));
        const wisdom = Number(character.getAbilityScore("wisdom"));
        if (dexterity >= 13 && wisdom >= 13) {
            return {
                isEligible: true,
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
