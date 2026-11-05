
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class LeatherArmor {

    static get name() { return "leather-armor"; }
    static get title() { return "Leather"; }
    static get category() { return "armor"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(LeatherArmor, LeatherArmor.#content); }
    static get armorType() { return "light-armor"; }

    static get properties() {
        return [
            { name: "armor-name", value: LeatherArmor.name },
            { name: "armor-title", value: LeatherArmor.title },
            { name: "armor-type", value: "light-armor" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 10gp",
            "Armor Class: 11 + Dex modifier"
        ];
    }

    static getSelections(character, inventoryIndex) {
        return []
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = LeatherArmor.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${LeatherArmor.name}-inventory-index-${inventoryIndex}-ac-modifier`,
                target: "armor-class",
                value: 1,
                title: LeatherArmor.title
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = LeatherArmor.name;
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
            The breastplate and shoulder protectors of this armor are made of leather that has been stiffened by being boiled in oil. The rest of the armor is made of softer and more flexible materials.
        </p>
    `;
}
