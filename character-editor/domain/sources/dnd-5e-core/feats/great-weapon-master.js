
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class GreatWeaponMaster {

    static get name() {
        return "great-weapon-master";
    }

    static get title() {
        return "Great Weapon Master";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Great Weapon Master</h3>
            <hr/>
            <div class="content">
                [Great Weapon Master content here]
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
