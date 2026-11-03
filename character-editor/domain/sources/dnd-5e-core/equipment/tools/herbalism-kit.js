
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class HerbalismKit {

    static get name() { return "herbalism-kit"; }
    static get title() { return "Herbalism kit"; }
    static get category() { return "tools"; }
    static get canBeEquipped() { return false; }
    static get html() { return DnD5ESource.getEquipmentHtml(HerbalismKit, HerbalismKit.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return [];
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
        tempFeatures.push(character.getFeatureCard(HerbalismKit.name, HerbalismKit.title, HerbalismKit.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = HerbalismKit.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            This kit contains a variety of instruments such as clippers, mortar and pestle, and Pouches and Vials used by herbalists to create remedies and Potions. Proficiency with this kit lets you add your proficiency bonus to any ability checks you make to identify or apply herbs. Also, proficiency with this kit is required to create Antitoxin and any Potion of Healing.
        </p>
    `;

}
