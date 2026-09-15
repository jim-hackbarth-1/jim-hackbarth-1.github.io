
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class ElementalAdept {

    static get name() {
        return "elemental-adept";
    }

    static get title() {
        return "Elemental Adept";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>ElementalAdept</h3>
            <hr/>
            <div class="content">
                [Elemental Adept content here]
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
