
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class Alert {

    static get name() {
        return "alert";
    }

    static get title() {
        return "Alert";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Alert</h3>
            <hr/>
            <div class="content">
                [Alert content here]
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
