
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class SpellSniper {

    static get name() {
        return "spell-sniper";
    }

    static get title() {
        return "Spell Sniper";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Spell Sniper</h3>
            <hr/>
            <div class="content">
                [Spell Sniper content here]
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
