
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class SaddleExotic {

    static get name() { return "saddle-exotic"; }
    static get title() { return "Saddle, exotic"; }
    static get category() { return "mounts-and-vehicles"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(SaddleExotic, SaddleExotic.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 60gp"];
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
                `equipment-${inventoryIndex}-${SaddleExotic.name}`, SaddleExotic.title, SaddleExotic.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = SaddleExotic.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            An exotic saddle is required for riding any aquatic or flying mount.
        </p>
    `;

}
