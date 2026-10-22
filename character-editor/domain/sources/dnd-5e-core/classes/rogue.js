
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

    static getSelections(character, classIndex) {
        return [];
    }

    static getSelectionOptions(character, classIndex, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, classIndex, targetFilters) {

    }

    static applyFeatures(features, character, classIndex) {

    }

    static applySpells(spells, character, classIndex) {

    }

}
