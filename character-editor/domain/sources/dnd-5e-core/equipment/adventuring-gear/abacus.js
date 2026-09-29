
import { DnD5EUtilities } from "./../../dnd-5e-core-utilities.js"

export class Abacus {

    static get name() {
        return "abacus";
    }

    static get title() {
        return "Abacus";
    }

    static get category() {
        return "adventuring-gear";
    }

    static get properties() {
        return [];
    }

    static get html() {
        return `
        <div class="dnd-5e-content">
            ${DnD5EUtilities.getContentStyle()}
            <h3>Abacus</h3>
            <hr/>
            <div class="content">
                [Abacus content here]
            </div>
        </div>
        `;
    }

    static getOptions(character, iventoryIndex) {
        return [];
    }

    static updateFeatures(character, inventoryIndex) {

    }

}
