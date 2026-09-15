
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class LightlyArmored {

    static get name() {
        return "lightly-armored";
    }

    static get title() {
        return "Lightly Armored";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Lightly Armored</h3>
            <hr/>
            <div class="content">
                [Lightly Armored content here]
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
