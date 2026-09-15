
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class Charger {

    static get name() {
        return "charger";
    }

    static get title() {
        return "Charger";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Charger</h3>
            <hr/>
            <div class="content">
                [Charger content here]
            </div>
        </div>
        `;
    }

    static get canBeTakenMultipleTimes() {
        return false;
    }

    static checkPrerequisites(character) {
        return { prerequisitesMet: true, text: null };
    }

    static getOptions(character, classIndex, level) {
        return [];
    }

    static updateFeatures(character) {

    }

}
