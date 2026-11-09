
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class SentinelShield {

    static get name() { return "sentinel-shield"; }
    static get title() { return "Sentinel Shield"; }
    static get category() { return "armor-magical"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(SentinelShield, SentinelShield.#content); }
    static get armorType() { return "shield"; }

    static get properties() {
        return [
            { name: "is-shield" },
            { name: "armor-name", value: "shield" },
            { name: "armor-title", value: SentinelShield.title },
            { name: "armor-type", value: "shield" },
            { name: "ac-modifier", value: "2" }
        ];
    }

    static get displayProperties() {
        return ["Uncommon"];
    }

    static getSelections(character, inventoryIndex) {
        return []
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = SentinelShield.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${SentinelShield.name}-inventory-index-${inventoryIndex}-ac-modifier`,
                target: "armor-class",
                value: 2,
                title: SentinelShield.title
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = SentinelShield.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getFeatureCard(
                `equipment-${inventoryIndex}-${SentinelShield.name}`, SentinelShield.title, SentinelShield.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = SentinelShield.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            While holding this shield, you have advantage on initiative rolls and Wisdom (Perception) checks. The shield is emblazoned with the symbol of an eye.
        </p>
    `;
}
