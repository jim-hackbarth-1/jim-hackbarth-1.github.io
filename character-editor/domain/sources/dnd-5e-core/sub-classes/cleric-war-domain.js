
export class ClericWarDomain{

    static get name() {
        return "cleric-war-domain";
    }

    static get title() {
        return "War Domain";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/cleric-war-domain.html";
    }

    static get className() {
        return "cleric";
    }

    static getSelections(character, classIndex) {
        return [];
    }

    static getSelectionOptions(character, classIndex, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, classIndex) {

    }

    static applyFeatures(features, character, classIndex) {

    }

    static applySpells(spells, character, classIndex) {

    }

}
