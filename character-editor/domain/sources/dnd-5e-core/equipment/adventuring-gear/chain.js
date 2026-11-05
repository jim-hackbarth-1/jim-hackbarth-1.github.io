
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Chain {

    static get name() { return "chain"; }
    static get title() { return "Chain (10 feet)"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(Chain, Chain.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 5gp"];
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
            tempFeatures.push(character.getFeatureCard(`equipment-${inventoryIndex}-${Chain.name}`, Chain.title, Chain.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Chain.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            A chain has 10 hit points. It can be burst with a successful DC 20 Strength check.
        </p>
    `;

}
