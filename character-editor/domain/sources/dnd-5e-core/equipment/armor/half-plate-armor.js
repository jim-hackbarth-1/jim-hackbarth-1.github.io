
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class HalfPlateArmor {

    static get name() { return "half-plate-armor"; }
    static get title() { return "Half plate"; }
    static get category() { return "armor"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(HalfPlateArmor, HalfPlateArmor.#content); }
    static get armorType() { return "medium-armor"; }

    static get properties() {
        return [
            { name: "is-armor" },
            { name: "stealth-disadvantage" },
            { name: "armor-name", value: HalfPlateArmor.name },
            { name: "armor-title", value: HalfPlateArmor.title },
            { name: "armor-type", value: "medium-armor" },
            { name: "ac-modifier", value: "5" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 750gp",
            "Armor Class: 15 + Dex modifier (max 2)",
            "Stealth: Disadvantage"
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
        item.properties = HalfPlateArmor.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${HalfPlateArmor.name}-inventory-index-${inventoryIndex}-ac-modifier`,
                target: "armor-class",
                value: 5,
                title: HalfPlateArmor.title
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = HalfPlateArmor.name;
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
            Half plate consists of shaped metal plates that cover most of the wearer's body. It does not include leg protection beyond simple greaves that are attached with leather straps.
        </p>
    `;

}
