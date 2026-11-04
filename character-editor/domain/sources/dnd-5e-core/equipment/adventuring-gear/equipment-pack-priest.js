
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class EquipmentPackPriest {

    static get name() { return "equipment-pack-priest"; }
    static get title() { return "Equipment pack - Priest"; }
    static get category() { return "adventuring-gear"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(EquipmentPackPriest, EquipmentPackPriest.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 19gp"];
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
        tempFeatures.push(character.getFeatureCard(EquipmentPackPriest.name, EquipmentPackPriest.title, EquipmentPackPriest.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = EquipmentPackPriest.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            Backpack, a blanket, 10 candles, a tinderbox, an alms box, 2 blocks of incense, a censer, vestments, 2 days of rations, and a waterskin.
        </p>
    `;

}
