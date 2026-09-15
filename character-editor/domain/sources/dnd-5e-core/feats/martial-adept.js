
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class MartialAdept {

    static get name() {
        return "martial-adept";
    }

    static get title() {
        return "Martial Adept";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Martial Adept</h3>
            <hr/>
            <div class="content">
                [Martial Adept content here]
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
