
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ArrowCatchingShield {

    static get name() { return "arrow-catching-shield"; }
    static get title() { return "Arrow Catching Shield"; }
    static get category() { return "armor-magical"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(ArrowCatchingShield, ArrowCatchingShield.#content); }
    static get armorType() { return "shield"; }

    static get properties() {
        return [
            { name: "is-shield" },
            { name: "attunement" },
            { name: "armor-name", value: "shield" },
            { name: "armor-title", value: ArrowCatchingShield.title },
            { name: "armor-type", value: "shield" },
            { name: "ac-modifier", value: "2" }
        ];
    }

    static get displayProperties() {
        return ["Rare", "Requires attunement"];
    }

    static getSelections(character, inventoryIndex) {
        return []
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = ArrowCatchingShield.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${ArrowCatchingShield.name}-inventory-index-${inventoryIndex}-ac-modifier`,
                target: "armor-class",
                value: 2,
                title: ArrowCatchingShield.title
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = ArrowCatchingShield.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getFeatureCard(
                `equipment-${inventoryIndex}-${ArrowCatchingShield.name}`, ArrowCatchingShield.title, ArrowCatchingShield.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = ArrowCatchingShield.name;
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
