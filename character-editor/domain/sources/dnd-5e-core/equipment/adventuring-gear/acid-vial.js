
import { DnD5EUtilities } from "./../../dnd-5e-core-utilities.js"

export class AcidVial {

    static get name() {
        return "acid-vial";
    }

    static get title() {
        return "Acid (vial)";
    }

    static get category() {
        return "adventuring-gear";
    }

    static get properties() {
        return [
            "prop 1",
            "prop 2",
            "prop 3"
        ];
    }

    static get html() {
        return `
        <div class="dnd-5e-content">
            ${DnD5EUtilities.getContentStyle()}
            <h3>Acid (vial)</h3>
            <hr/>
            <div class="content">
                [Acid (vial) content here]
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
