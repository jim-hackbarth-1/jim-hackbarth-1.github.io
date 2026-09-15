
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class DefensiveDuelist {

    static get name() {
        return "defensive-duelist";
    }

    static get title() {
        return "Defensive Duelist";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Defensive Duelist</h3>
            <hr/>
            <div class="content">
                [Defensive Duelist content here]
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
