
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ElvenChain {

    static get name() { return "elven-chain"; }
    static get title() { return "Elven chain (Chain shirt)"; }
    static get category() { return "armor-magical"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(ElvenChain, ElvenChain.#content); }
    static get armorType() { return "medium-armor"; }

    static get properties() {
        return [
            { name: "is-armor" },
            { name: "armor-name", value: ElvenChain.name },
            { name: "armor-title", value: ElvenChain.title },
            { name: "armor-type", value: "medium-armor" },
            { name: "ac-modifier", value: "4" }
        ];
    }

    static get displayProperties() {
        return ["Rare"];
    }

    static getSelections(character, inventoryIndex) {
        return []
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = ElvenChain.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${ElvenChain.name}-inventory-index-${inventoryIndex}-ac-modifier`,
                target: "armor-class",
                value: 4,
                title: ElvenChain.title
            });
            modifiers.push({
                name: `${ElvenChain.name}-inventory-index-${inventoryIndex}-medium-armor-proficiency`,
                title: "Armor proficiency",
                value: "medium-armor",
                target: "armor-proficiency"
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = ElvenChain.name;
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
            Made of interlocking metal rings, a chain shirt is worn between layers of clothing or leather. This armor offers modest protection to the wearer's upper body and allows the sound of the rings rubbing against one another to be muffled by outer layers.
        </p>
    `;

}
