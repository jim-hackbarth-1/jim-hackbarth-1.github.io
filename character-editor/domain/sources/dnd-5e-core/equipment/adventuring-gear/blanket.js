
export class Blanket {

    static get name() {
        return "blanket";
    }

    static get title() {
        return "Blanket";
    }

    static get category() {
        return "adventuring-gear";
    }

    static get properties() {
        return ["Cost: 5sp"];
    }

    static get canBeEquipped() {
        return false;
    }

    static get html() {
        return "";
    }

    static getSelections(character, inventoryIndex) {
        return [];
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, inventoryIndex) {

    }

    static applyFeatures(features, character, inventoryIndex) {

    }

}
