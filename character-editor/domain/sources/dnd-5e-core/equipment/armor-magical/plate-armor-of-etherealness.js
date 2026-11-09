
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class PlateArmorOfEtherealness {

    static get name() { return "plate-armor-of-etherealness"; }
    static get title() { return "Plate Armor of Etherealness"; }
    static get category() { return "armor-magical"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(PlateArmorOfEtherealness, PlateArmorOfEtherealness.#content); }
    static get armorType() { return "heavy-armor"; }

    static get properties() {
        return [
            { name: "is-armor" },
            { name: "attunement" },
            { name: "stealth-disadvantage" },
            { name: "armor-name", value: PlateArmorOfEtherealness.name },
            { name: "armor-title", value: PlateArmorOfEtherealness.title },
            { name: "armor-type", value: "heavy-armor" },
            { name: "ac-modifier", value: "8" },
            { name: "strength", value: "15" }
        ];
    }

    static get displayProperties() {
        return [
            "Legendary",
            "Requires attunement"
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
        item.properties = PlateArmorOfEtherealness.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${PlateArmorOfEtherealness.name}-inventory-index-${inventoryIndex}-ac-modifier`,
                target: "armor-class",
                value: 8,
                title: PlateArmorOfEtherealness.title
            });

            const strength = character.getAbilityScore("strength");
            if (Number(strength) < 15) {
                modifiers.push({
                    name: `${PlateArmorOfEtherealness.name}-inventory-index-${inventoryIndex}-speed-modifier`,
                    target: "speed",
                    value: -10,
                    title: PlateArmorOfEtherealness.title
                });
            }
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = PlateArmorOfEtherealness.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            const feature = character.getFeatureCard(
                `equipment-${inventoryIndex}-${PlateArmorOfEtherealness.name}`, PlateArmorOfEtherealness.title, PlateArmorOfEtherealness.#content);
            feature.useInfo = {
                reset: "next-dawn",
                uses: 1
            };
            tempFeatures.push(feature);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = PlateArmorOfEtherealness.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {
        const tempSpells = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempSpells.push("etherealness");
        }
        for (const spell of tempSpells) {
            spells.push(spell);
        }
    }

    static #content = `
        <p>
            While you're wearing this armor, you can speak its command word as an action to gain the effect of the Etherealness spell, which last for 10 minutes or until you remove the armor or use an action to speak the command word again. This property of the armor can't be used again until the next dawn.
        </p>
    `;
}
