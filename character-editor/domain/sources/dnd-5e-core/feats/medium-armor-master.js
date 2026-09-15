
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class MediumArmorMaster {

    static get name() {
        return "medium-armor-master";
    }

    static get title() {
        return "Medium Armor Master";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Medium Armor Master</h3>
            <hr/>
            <div class="content">
                [Medium Armor Master content here]
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
