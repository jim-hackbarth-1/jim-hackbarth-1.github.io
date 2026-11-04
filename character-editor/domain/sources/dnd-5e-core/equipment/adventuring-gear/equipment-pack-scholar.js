
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class EquipmentPackScholar {

    static get name() { return "equipment-pack-scholar"; }
    static get title() { return "Equipment pack - Scholar"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(EquipmentPackScholar, EquipmentPackScholar.#content); }

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
        tempFeatures.push(character.getFeatureCard(EquipmentPackScholar.name, EquipmentPackScholar.title, EquipmentPackScholar.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = EquipmentPackScholar.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            Backpack, a book of lore, a bottle of ink, an ink pen, 10 sheets of parchment, a little bag of sand, and a small knife.
        </p>
    `;

}
