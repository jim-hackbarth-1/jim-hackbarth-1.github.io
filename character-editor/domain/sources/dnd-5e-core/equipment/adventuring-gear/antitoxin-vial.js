
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class AntitoxinVial {

    static get name() { return "antitoxin-vial"; }
    static get title() { return "Antitoxin (vial)"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(AntitoxinVial, AntitoxinVial.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 50gp"];
    }

    static getSelections(character, inventoryIndex) {
        return [];
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        tempFeatures.push(character.getFeatureCard(AntitoxinVial.name, AntitoxinVial.title, AntitoxinVial.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = AntitoxinVial.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            A creature that drinks this vial of liquid gains advantage on saving throws against poison for 1 hour. It confers no benefits to undead or constructs.
        </p>
    `;

}
