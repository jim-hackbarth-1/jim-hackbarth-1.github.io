
export class Halfling {

    static get name() {
        return "halfling";
    }

    static get title() {
        return "Halfling";
    }

    static get htmlPath() {
        return "dnd-5e-core/races/halfling.html";
    }

    static get speed() {
        return 25;
    }

    static get size() {
        return "medium";
    }

    static getOptions(character) {
        return [];
    }

    static updateFeatures(character) {

    }

}
