
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class HeavilyArmored {

    static get name() {
        return "heavily-armored";
    }

    static get title() {
        return "Heavily Armored";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Heavily Armored</h3>
            <hr/>
            <div class="content">
                [Heavily Armored content here]
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
