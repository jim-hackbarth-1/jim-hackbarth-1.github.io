
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class EfreetiChainMail {

    static get name() { return "efreeti-chain-mail"; }
    static get title() { return "Efreeti chain mail"; }
    static get category() { return "armor-magical"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(EfreetiChainMail, EfreetiChainMail.#content); }
    static get armorType() { return "heavy-armor"; }

    static get properties() {
        return [
            { name: "is-armor" },
            { name: "attunement" },
            { name: "stealth-disadvantage" },
            { name: "armor-name", value: EfreetiChainMail.name },
            { name: "armor-title", value: EfreetiChainMail.title },
            { name: "armor-type", value: "heavy-armor" },
            { name: "ac-modifier", value: "9" },
            { name: "strength", value: "13" }
        ];
    }

    static get displayProperties() {
        return [
            "Legendary",
            "Requires attunement"];
    }

    static getSelections(character, inventoryIndex) {
        return []
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = EfreetiChainMail.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${EfreetiChainMail.name}-inventory-index-${inventoryIndex}-ac-modifier`,
                target: "armor-class",
                value: 9,
                title: EfreetiChainMail.title
            });

            const strength = character.getAbilityScore("strength");
            if (Number(strength) < 13) {
                modifiers.push({
                    name: `${EfreetiChainMail.name}-inventory-index-${inventoryIndex}-speed-modifier`,
                    target: "speed",
                    value: -10,
                    title: EfreetiChainMail.title
                });
            }

            modifiers.push({
                name: `${EfreetiChainMail.name}-inventory-index-${inventoryIndex}-language-primordial`,
                title: "Language",
                value: { value: "primordial", text: "Primordial" },
                target: "language"
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = EfreetiChainMail.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getFeatureCard(
                `equipment-${inventoryIndex}-${EfreetiChainMail.name}`, EfreetiChainMail.title, EfreetiChainMail.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = EfreetiChainMail.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            While wearing this armor, you gain a +3 bonus to AC, you are immune to fire damage, and you can understand and speak Primordial. In addition, you can stand on and walk across molten rock as if it were solid ground.
        </p>
    `;

}
