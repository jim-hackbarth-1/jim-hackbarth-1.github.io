
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class Healer {

    static get name() {
        return "healer";
    }

    static get title() {
        return "Healer";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Healer</h3>
            <hr/>
            <div class="content">
                [Healer content here]
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
