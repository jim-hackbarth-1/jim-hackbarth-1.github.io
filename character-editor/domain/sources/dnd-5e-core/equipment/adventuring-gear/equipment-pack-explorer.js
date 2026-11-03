
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class EquipmentPackExplorer {

    static get name() { return "equipment-pack-explorer"; }
    static get title() { return "Equipment pack - Explorer"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return false; }
    static get html() { return DnD5ESource.getEquipmentHtml(EquipmentPackExplorer, EquipmentPackExplorer.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 10gp"];
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
        tempFeatures.push(character.getFeatureCard(EquipmentPackExplorer.name, EquipmentPackExplorer.title, EquipmentPackExplorer.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = EquipmentPackExplorer.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            Backpack, a bedroll, a mess kit, a tinderbox, 10 torches, 10 days of rations, and a waterskin. The pack also has 50 feet of hempen rope strapped to the side of it.
        </p>
    `;

}
