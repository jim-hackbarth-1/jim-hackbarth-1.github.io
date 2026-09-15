
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class MagicInitiate {

    static get name() {
        return "magic-initiate";
    }

    static get title() {
        return "Magic Initiate";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Magic Initiate</h3>
            <hr/>
            <div class="content">
                [Magic Initiate content here]
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
