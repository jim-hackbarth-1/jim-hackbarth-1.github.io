
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class EquipmentPackDiplomat{

    static get name() { return "equipment-pack-diplomat"; }
    static get title() { return "Equipment pack - Diplomat"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(EquipmentPackDiplomat, EquipmentPackDiplomat.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 39gp"];
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
                `equipment-${inventoryIndex}-${EquipmentPackDiplomat.name}`, EquipmentPackDiplomat.title, EquipmentPackDiplomat.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = EquipmentPackDiplomat.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            Chest, 2 cases for maps and scrolls, a set of fine clothes, a bottle of ink, an ink pen, a lamp, 2 flasks of oil, 5 sheets of paper, a vial of perfume, sealing wax, and soap.
        </p>
    `;

}
