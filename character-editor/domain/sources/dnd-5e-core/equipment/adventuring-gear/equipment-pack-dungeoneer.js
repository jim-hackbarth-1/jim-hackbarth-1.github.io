
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class EquipmentPackDungeoneer {

    static get name() { return "equipment-pack-dungeoneer"; }
    static get title() { return "Equipment pack - Dungeoneer"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(EquipmentPackDungeoneer, EquipmentPackDungeoneer.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 12gp"];
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
        tempFeatures.push(character.getFeatureCard(EquipmentPackDungeoneer.name, EquipmentPackDungeoneer.title, EquipmentPackDungeoneer.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = EquipmentPackDungeoneer.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            Backpack, a crowbar, a hammer, 10 pitons, 10 torches, a tinderbox, 10 days of rations, and a waterskin. The pack also has 50 feet of hempen rope strapped to the side of it
        </p>
    `;

}
