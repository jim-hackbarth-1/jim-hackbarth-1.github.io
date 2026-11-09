
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class DwarvenPlateArmor {

    static get name() { return "dwarven-plate-armor"; }
    static get title() { return "Dwarven Plate"; }
    static get category() { return "armor-magical"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(DwarvenPlateArmor, DwarvenPlateArmor.#content); }
    static get armorType() { return "heavy-armor"; }

    static get properties() {
        return [
            { name: "is-armor" },
            { name: "stealth-disadvantage" },
            { name: "armor-name", value: DwarvenPlateArmor.name },
            { name: "armor-title", value: DwarvenPlateArmor.title },
            { name: "armor-type", value: "heavy-armor" },
            { name: "ac-modifier", value: "10" },
            { name: "strength", value: "15" }
        ];
    }

    static get displayProperties() {
        return [
            "Very rare"
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
        item.properties = DwarvenPlateArmor.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${DwarvenPlateArmor.name}-inventory-index-${inventoryIndex}-ac-modifier`,
                target: "armor-class",
                value: 10,
                title: DwarvenPlateArmor.title
            });

            const strength = character.getAbilityScore("strength");
            if (Number(strength) < 15) {
                modifiers.push({
                    name: `${DwarvenPlateArmor.name}-inventory-index-${inventoryIndex}-speed-modifier`,
                    target: "speed",
                    value: -10,
                    title: DwarvenPlateArmor.title
                });
            }
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = DwarvenPlateArmor.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getFeatureCard(
                `equipment-${inventoryIndex}-${DwarvenPlateArmor.name}`, DwarvenPlateArmor.title, DwarvenPlateArmor.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = DwarvenPlateArmor.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            While wearing this armor, you gain a +2 bonus to AC. In addition, if an effect moves you against your will along the ground, you can use your reaction to reduce the distance you are moved by up to 10 feet.
        </p>
    `;
}
