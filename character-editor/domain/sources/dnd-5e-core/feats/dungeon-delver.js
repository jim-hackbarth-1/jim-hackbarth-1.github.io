
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

export class DungeonDelver {

    static get name() {
        return "dungeon-delver";
    }

    static get title() {
        return "Dungeon Delver";
    }

    static get html() {
        return `
        <div class="dnd-5e-content">
            <link rel="stylesheet" type="text/css" href="./domain/sources/dnd-5e-core/dnd-5e-core.css">
            <h3>DungeonDelver</h3>
            <hr/>
            <div class="content">
                [DungeonDelver content here]
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
