
export class RogueArcaneTrickster {

    static get name() {
        return "rogue-arcane-trickster";
    }

    static get title() {
        return "Arcane Trickster";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/rogue-arcane-trickster.html";
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
