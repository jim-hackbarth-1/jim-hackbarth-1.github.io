
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class RitualCaster {

    static get name() {
        return "ritual-caster";
    }

    static get title() {
        return "Ritual Caster";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Ritual Caster</h3>
            <hr/>
            <div class="content">
                [Ritual Caster content here]
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
