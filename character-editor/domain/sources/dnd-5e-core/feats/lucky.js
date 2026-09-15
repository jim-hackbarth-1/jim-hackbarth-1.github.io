
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class Lucky {

    static get name() {
        return "lucky";
    }

    static get title() {
        return "Lucky";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Lucky</h3>
            <hr/>
            <div class="content">
                [Lucky content here]
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
