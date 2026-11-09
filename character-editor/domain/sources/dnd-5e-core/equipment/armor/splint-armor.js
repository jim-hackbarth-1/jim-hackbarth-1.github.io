
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class SplintArmor {

    static get name() { return "splint-armor"; }
    static get title() { return "Splint"; } 
    static get category() { return "armor"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(SplintArmor, SplintArmor.#content); }
    static get armorType() { return "heavy-armor"; }

    static get properties() {
        return [
            { name: "is-armor" },
            { name: "stealth-disadvantage" },
            { name: "armor-name", value: SplintArmor.name },
            { name: "armor-title", value: SplintArmor.title },
            { name: "armor-type", value: "heavy-armor" },
            { name: "ac-modifier", value: "7" },
            { name: "strength", value: "15" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 200gp",
            "Armor Class: 17",
            "Strength requirement: 15",
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
        item.properties = SplintArmor.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${SplintArmor.name}-inventory-index-${inventoryIndex}-ac-modifier`,
                target: "armor-class",
                value: 7,
                title: SplintArmor.title
            });

            const strength = character.getAbilityScore("strength");
            if (Number(strength) < 15) {
                modifiers.push({
                    name: `${SplintArmor.name}-inventory-index-${inventoryIndex}-speed-modifier`,
                    target: "speed",
                    value: -10,
                    title: SplintArmor.title
                });
            }
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = SplintArmor.name;
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
            This armor is made of narrow vertical strips of metal riveted to a backing of leather that is worn over cloth padding. Flexible chain mail protects the joints.
        </p>
    `;
}
