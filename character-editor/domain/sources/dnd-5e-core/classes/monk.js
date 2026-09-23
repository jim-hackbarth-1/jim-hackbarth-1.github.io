
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

    static get hitDieSize() {
        return 8;
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
