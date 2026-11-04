
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ComponentPouch {

    static get name() { return "component-pouch"; }
    static get title() { return "Component pouch"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(ComponentPouch, ComponentPouch.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 25gp"];
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
        tempFeatures.push(character.getFeatureCard(ComponentPouch.name, ComponentPouch.title, ComponentPouch.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = ComponentPouch.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            A component pouch is a small, watertight leather belt pouch that has compartments to hold all the material components and other special items you need to cast your spells, except for those components that have a specific cost (as indicated in a spell's description).
        </p>
    `;

}
