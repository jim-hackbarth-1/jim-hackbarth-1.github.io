
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ChainMailArmor {

    static get name() { return "chain-mail-armor"; }
    static get title() { return "Chain mail"; }
    static get category() { return "armor"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(ChainMailArmor, ChainMailArmor.#content); }
    static get armorType() { return "heavy-armor"; }

    static get properties() {
        return [
            { name: "is-armor" },
            { name: "stealth-disadvantage" },
            { name: "armor-name", value: ChainMailArmor.name },
            { name: "armor-title", value: ChainMailArmor.title },
            { name: "armor-type", value: "heavy-armor" },
            { name: "ac-modifier", value: "6" },
            { name: "strength", value: "13" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 50gp",
            "Armor Class: 16",
            "Strength requirement: 13",
            "Stealth: Disadvantage"];
    }

    static getSelections(character, inventoryIndex) {
        return []
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = ChainMailArmor.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${ChainMailArmor.name}-inventory-index-${inventoryIndex}-ac-modifier`,
                target: "armor-class",
                value: 6,
                title: ChainMailArmor.title
            });

            const strength = character.getAbilityScore("strength");
            if (Number(strength) < 13) {
                modifiers.push({
                    name: `${ChainMailArmor.name}-inventory-index-${inventoryIndex}-speed-modifier`,
                    target: "speed",
                    value: -10,
                    title: ChainMailArmor.title
                });
            }
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = ChainMailArmor.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {

    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            Made of interlocking metal rings, chain mail includes a layer of quilted fabric worn underneath the mail to prevent chafing and to cushion the impact of blows. The suit includes gauntlets.
        </p>
    `;

}
