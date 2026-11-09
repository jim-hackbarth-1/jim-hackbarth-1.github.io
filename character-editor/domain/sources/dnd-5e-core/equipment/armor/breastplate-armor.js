
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class BreastPlateArmor {

    static get name() { return "breastplate-armor"; }
    static get title() { return "Breastplate"; }
    static get category() { return "armor"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(BreastPlateArmor, BreastPlateArmor.#content); }
    static get armorType() { return "medium-armor"; }

    static get properties() {
        return [
            { name: "is-armor" },
            { name: "armor-name", value: BreastPlateArmor.name },
            { name: "armor-title", value: BreastPlateArmor.title },
            { name: "armor-type", value: "medium-armor" },
            { name: "ac-modifier", value: "4" }
        ];
    }

    static get displayProperties() {
        return ["Cost: 400gp", "Armor Class: 14 + Dex modifier (max 2)"];
    }

    static getSelections(character, inventoryIndex) {
        return []
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = BreastPlateArmor.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${BreastPlateArmor.name}-inventory-index-${inventoryIndex}-ac-modifier`,
                target: "armor-class",
                value: 4,
                title: BreastPlateArmor.title
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = BreastPlateArmor.name;
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
            This armor consists of a fitted metal chest piece worn with supple leather. Although it leaves the legs and arms relatively unprotected, this armor provides good protection for the wearer's vital organs while leaving the wearer relatively unencumbered.
        </p>
    `;

}
