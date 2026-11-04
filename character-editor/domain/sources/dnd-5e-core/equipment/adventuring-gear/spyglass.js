
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Spyglass {

    static get name() { return "spyglass"; }
    static get title() { return "Spyglass"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(Spyglass, Spyglass.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 1,000gp"];
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
        tempFeatures.push(character.getFeatureCard(Spyglass.name, Spyglass.title, Spyglass.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Spyglass.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            Objects viewed through a spyglass are magnified to twice their size.
        </p>
    `;

}
