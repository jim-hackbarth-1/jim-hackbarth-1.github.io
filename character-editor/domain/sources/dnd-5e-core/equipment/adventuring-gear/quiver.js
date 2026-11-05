
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Quiver {

    static get name() { return "quiver"; }
    static get title() { return "Quiver"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(Quiver, Quiver.#content); }

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
            tempFeatures.push(character.getFeatureCard(`equipment-${inventoryIndex}-${Quiver.name}`, Quiver.title, Quiver.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Quiver.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            A quiver can hold up to twenty arrows.
        </p>
    `;

}
