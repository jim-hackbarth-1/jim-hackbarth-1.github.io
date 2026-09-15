
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class Resilient {

    static get name() {
        return "resilient";
    }

    static get title() {
        return "Resilient";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Resilient</h3>
            <hr/>
            <div class="content">
                [Resilient content here]
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
