
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Tent {

    static get name() { return "tent"; }
    static get title() { return "Tent, two-person"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(Tent, Tent.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 2gp"];
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
        tempFeatures.push(character.getFeatureCard(Tent.name, Tent.title, Tent.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Tent.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            A simple and portable canvas shelter, a tent sleeps two.
        </p>
    `;

}
