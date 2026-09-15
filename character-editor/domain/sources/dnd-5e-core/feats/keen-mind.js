
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class KeenMind {

    static get name() {
        return "keen-mind";
    }

    static get title() {
        return "Keen Mind";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Keen Mind</h3>
            <hr/>
            <div class="content">
                [Keen Mind content here]
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
