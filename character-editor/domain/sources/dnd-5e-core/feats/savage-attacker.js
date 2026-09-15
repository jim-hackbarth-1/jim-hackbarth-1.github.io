
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class SavageAttacker {

    static get name() {
        return "savage-attacker";
    }

    static get title() {
        return "Savage Attacker";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Savage Attacker</h3>
            <hr/>
            <div class="content">
                [Savage Attacker content here]
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
