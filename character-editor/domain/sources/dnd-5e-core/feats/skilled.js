
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class Skilled {

    static get name() {
        return "skilled";
    }

    static get title() {
        return "Skilled";
    }

    static get html() {
        return `
        <div class="dnd-5e-content">
            ${DnD5EUtilities.getContentStyle()}
            <h3>Skilled</h3>
            <hr/>
            <div class="content">
                [Skilled content here]
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
