
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class Grappler {

    static get name() {
        return "grappler";
    }

    static get title() {
        return "Grappler";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Grappler</h3>
            <hr/>
            <div class="content">
                [Grappler content here]
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
