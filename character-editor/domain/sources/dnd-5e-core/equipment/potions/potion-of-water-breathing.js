
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class PotionOfWaterBreathing {

    static get name() { return "potion-of-water-breathing"; }
    static get title() { return "Potion of Water Breathing"; }
    static get category() { return "potions"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(PotionOfWaterBreathing, PotionOfWaterBreathing.#content); }
    static get properties() { return []; }
    static get displayProperties() { return ["Uncommon"]; }

    static getSelections(character, inventoryIndex) {
        return []
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = PotionOfWaterBreathing.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getFeatureCard(
                PotionOfWaterBreathing.name, PotionOfWaterBreathing.title, PotionOfWaterBreathing.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = PotionOfWaterBreathing.name;
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            You can breathe underwater for 1 hour after drinking this potion. Its cloudy green fluid smells of the sea and has a jellyfish-like bubble floating in it.
        </p>
    `;

}
