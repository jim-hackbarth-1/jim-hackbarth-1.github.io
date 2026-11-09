
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class SpellguardShield {

    static get name() { return "spellguard-shield"; }
    static get title() { return "Spellguard Shield"; }
    static get category() { return "armor-magical"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(SpellguardShield, SpellguardShield.#content); }
    static get armorType() { return "shield"; }

    static get properties() {
        return [
            { name: "is-shield" },
            { name: "attunement" },
            { name: "armor-name", value: "shield" },
            { name: "armor-title", value: SpellguardShield.title },
            { name: "armor-type", value: "shield" },
            { name: "ac-modifier", value: "2" }
        ];
    }

    static get displayProperties() {
        return ["Very rare", "Requires attunement"];
    }

    static getSelections(character, inventoryIndex) {
        return []
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = SpellguardShield.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${SpellguardShield.name}-inventory-index-${inventoryIndex}-ac-modifier`,
                target: "armor-class",
                value: 2,
                title: SpellguardShield.title
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = SpellguardShield.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getFeatureCard(
                `equipment-${inventoryIndex}-${SpellguardShield.name}`, SpellguardShield.title, SpellguardShield.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = SpellguardShield.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            While holding this shield, you have advantage on saving throws against spells and other magical effects, and spell attacks have disadvantage against you.
        </p>
    `;
}
