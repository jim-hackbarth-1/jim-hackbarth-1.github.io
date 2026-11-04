
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class EquipmentPackBurglar {

    static get name() { return "equipment-pack-burglar"; }
    static get title() { return "Equipment pack - Burglar"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(EquipmentPackBurglar, EquipmentPackBurglar.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 16gp"];
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
        tempFeatures.push(character.getFeatureCard(EquipmentPackBurglar.name, EquipmentPackBurglar.title, EquipmentPackBurglar.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = EquipmentPackBurglar.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            Backpack, a bag of 1,000 ball bearings, 10 feet of string, a bell, 5 candles, a crowbar, a hammer, 10 pitons, a hooded lantern, 2 flasks of oil, 5 days rations, a tinderbox and a waterskin. The pack also has 50 feet of hempen rope strapped to the side of it.
        </p>
    `;

}
