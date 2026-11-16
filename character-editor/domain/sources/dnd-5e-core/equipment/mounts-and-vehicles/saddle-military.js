
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class SaddleMilitary {

    static get name() { return "saddle-military"; }
    static get title() { return "Saddle, military"; }
    static get category() { return "mounts-and-vehicles"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(SaddleMilitary, SaddleMilitary.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 20gp"];
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
                `equipment-${inventoryIndex}-${SaddleMilitary.name}`, SaddleMilitary.title, SaddleMilitary.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = SaddleMilitary.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            A military saddle braces the rider, helping you keep your seat on an active mount in battle. It gives you advantage on any check you make to remain mounted.
        </p>
    `;

}
