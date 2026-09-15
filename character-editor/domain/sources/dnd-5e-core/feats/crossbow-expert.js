
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class CrossbowExpert {

    static get name() {
        return "crossbow-expert";
    }

    static get title() {
        return "Crossbow Expert";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>CrossbowExpert</h3>
            <hr/>
            <div class="content">
                [Crossbow Expert content here]
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
