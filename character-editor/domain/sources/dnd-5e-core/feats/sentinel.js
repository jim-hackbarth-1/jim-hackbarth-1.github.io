
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class Sentinel {

    static get name() {
        return "sentinel";
    }

    static get title() {
        return "Sentinel";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Sentinel</h3>
            <hr/>
            <div class="content">
                [Sentinel content here]
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
