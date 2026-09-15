
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class Durable {

    static get name() {
        return "durable";
    }

    static get title() {
        return "Durable";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Durable</h3>
            <hr/>
            <div class="content">
                [Durable content here]
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
