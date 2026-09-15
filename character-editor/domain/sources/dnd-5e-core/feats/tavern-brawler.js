
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class TavernBrawler {

    static get name() {
        return "tavern-brawler";
    }

    static get title() {
        return "Tavern Brawler";
    }

    static get html() {
        return `
        <div class="dnd-5e-feat">
            ${DnD5EUtilities.getFeatStyle()}
            <h3>Tavern Brawler</h3>
            <hr/>
            <div class="content">
                [Tavern Brawler content here]
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
