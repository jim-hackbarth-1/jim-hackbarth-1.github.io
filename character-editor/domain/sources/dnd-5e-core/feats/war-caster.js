
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class WarCaster {

    static get name() {
        return "war-caster";
    }

    static get title() {
        return "War Caster";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>War Caster</h3>
            <hr/>
            <div class="content">
                [War Caster content here]
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
