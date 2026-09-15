
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class WeaponMaster {

    static get name() {
        return "weapon-master";
    }

    static get title() {
        return "Weapon Master";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Weapon Master</h3>
            <hr/>
            <div class="content">
                [Weapon Master content here]
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
