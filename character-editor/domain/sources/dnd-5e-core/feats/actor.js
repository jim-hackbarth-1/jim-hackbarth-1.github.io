
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class Actor {

    static get name() {
        return "actor";
    }

    static get title() {
        return "Actor";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Actor</h3>
            <hr/>
            <div class="content">
                [Actor content here]
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
