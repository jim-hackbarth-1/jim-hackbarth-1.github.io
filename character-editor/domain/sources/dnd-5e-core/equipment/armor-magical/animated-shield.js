
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class AnimatedShield {

    static get name() { return "animated-shield"; }
    static get title() { return "Animated Shield"; }
    static get category() { return "armor-magical"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(AnimatedShield, AnimatedShield.#content); }
    static get armorType() { return "shield"; }

    static get properties() {
        return [
            { name: "is-shield" },
            { name: "attunement" },
            { name: "armor-name", value: "shield" },
            { name: "armor-title", value: AnimatedShield.title },
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
        item.properties = AnimatedShield.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${AnimatedShield.name}-inventory-index-${inventoryIndex}-ac-modifier`,
                target: "armor-class",
                value: 2,
                title: AnimatedShield.title
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = AnimatedShield.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getFeatureCard(
                `equipment-${inventoryIndex}-${AnimatedShield.name}`, AnimatedShield.title, AnimatedShield.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = AnimatedShield.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            While holding this shield, you can speak its command word as a bonus action to cause it to animate. The shield leaps into the air and hovers in your space to protect you as if you were wielding it, leaving your hands free. The shield remains animated for 1 minute, until you use a bonus action to end this effect, or until you are incapacitated or die, at which point the shield falls to the ground or into your hand if you have one free.
        </p>
    `;
}
