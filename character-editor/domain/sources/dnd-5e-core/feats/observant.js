
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class Observant {

    static get name() {
        return "observant";
    }

    static get title() {
        return "Observant";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Observant</h3>
            <hr/>
            <div class="content">
                [Observant content here]
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
