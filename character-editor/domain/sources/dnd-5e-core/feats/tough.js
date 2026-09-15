
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class Tough {

    static get name() {
        return "tough";
    }

    static get title() {
        return "Tough";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Tough</h3>
            <hr/>
            <div class="content">
                [Tough content here]
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
