
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Rations {

    static get name() { return "rations"; }
    static get title() { return "Rations (1 day)"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(Rations, Rations.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 5sp"];
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
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getFeatureCard(`equipment-${inventoryIndex}-${Rations.name}`, Rations.title, Rations.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Rations.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            Rations consist of dry foods suitable for extended travel, including jerky, dried fruit, hardtack, and nuts.
        </p>
    `;

}
