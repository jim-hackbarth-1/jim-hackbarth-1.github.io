
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class CaseCrossbowBolt {

    static get name() { return "case-crossbow-bolt"; }
    static get title() { return "Case, crossbow bolt"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(CaseCrossbowBolt, CaseCrossbowBolt.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 1gp"];
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
            tempFeatures.push(character.getFeatureCard(
                `equipment-${inventoryIndex}-${CaseCrossbowBolt.name}`, CaseCrossbowBolt.title, CaseCrossbowBolt.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = CaseCrossbowBolt.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            This wooden case can hold up to twenty crossbow bolts.
        </p>
    `;

}
