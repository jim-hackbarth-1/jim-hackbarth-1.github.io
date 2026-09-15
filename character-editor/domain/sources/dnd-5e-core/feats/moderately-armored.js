
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class ModeratelyArmored {

    static get name() {
        return "moderately-armored";
    }

    static get title() {
        return "Moderately Armored";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Moderately Armored</h3>
            <hr/>
            <div class="content">
                [Moderately Armored content here]
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
