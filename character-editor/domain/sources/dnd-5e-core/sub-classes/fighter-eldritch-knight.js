
export class FighterEldritchKnight {

    static get name() {
        return "fighter-eldritch-knight";
    }

    static get title() {
        return "Eldritch Knight";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/fighter-eldritch-knight.html";
    }

    static get className() {
        return "fighter";
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
