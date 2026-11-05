
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class MessKit {

    static get name() { return "mess-kit"; }
    static get title() { return "Mess kit"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(MessKit, MessKit.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 2sp"];
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
                `equipment-${inventoryIndex}-${MessKit.name}`, MessKit.title, MessKit.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = MessKit.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            This tin box contains a cup and simple cutlery. The box clamps together, and one side can be used as a cooking pan and the other as a plate or shallow bowl.
        </p>
    `;

}
