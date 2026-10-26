
export class RogueConfidenceArtist {

    static get name() {
        return "rogue-confidence-artist";
    }

    static get title() {
        return "Confidence Artist";
    }

    static get htmlPath() {
        return "lands-of-aedun/sub-classes/rogue-confidence-artist.html";
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
