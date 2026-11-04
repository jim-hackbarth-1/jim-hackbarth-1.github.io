
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class EquipmentPackEntertainer {

    static get name() { return "equipment-pack-entertainer"; }
    static get title() { return "Equipment pack - Entertainer"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(EquipmentPackEntertainer, EquipmentPackEntertainer.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 40gp"];
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
        tempFeatures.push(character.getFeatureCard(EquipmentPackEntertainer.name, EquipmentPackEntertainer.title, EquipmentPackEntertainer.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = EquipmentPackEntertainer.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            Backpack, a bedroll, 2 costumes, 5 candles, 5 days of rations, a waterskin, and a disguise kit.
        </p>
    `;

}
