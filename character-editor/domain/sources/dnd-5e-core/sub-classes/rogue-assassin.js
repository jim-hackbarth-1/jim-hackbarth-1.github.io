
export class RogueAssassin {

    static get name() {
        return "rogue-assassin";
    }

    static get title() {
        return "Assassin";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/rogue-assassin.html";
    }

    static get className() {
        return "rogue";
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

    static getSpellCastingInfo(character, allSpells, classSpellCastingInfo) {
        return classSpellCastingInfo;
    }
}
