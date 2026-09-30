
import { DnD5EUtilities } from "./../../dnd-5e-core-utilities.js"

export class AlchemistsFireFlask {

    static get name() {
        return "alchemists-fire-flask";
    }

    static get title() {
        return "Alchemist's Fire (flask)";
    }

    static get category() {
        return "adventuring-gear";
    }

    static get properties() {
        return [];
    }

    static get canBeEquipped() {
        return true;
    }

    static get html() {
        return `
        <div class="dnd-5e-content">
            ${DnD5EUtilities.getContentStyle()}
            <h3>Alchemist's Fire (flask)</h3>
            <hr/>
            <div class="content">
                [Alchemist's Fire (flask) content here]
            </div>
        </div>
        `;
    }

    static getOptions(character, inventoryIndex) {
        return [];
    }

    static updateFeatures(character, inventoryIndex) {

    }

}
