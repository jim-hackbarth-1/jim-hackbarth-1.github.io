
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class DualWielder {

    static get name() {
        return "dual-wielder";
    }

    static get title() {
        return "Dual Wielder";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Dual Wielder</h3>
            <hr/>
            <div class="content">
                [Dual Wielder content here]
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
