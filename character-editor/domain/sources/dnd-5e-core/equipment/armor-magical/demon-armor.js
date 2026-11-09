
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class DemonArmor {

    static get name() { return "demon-armor"; }
    static get title() { return "Demon Armor (Plate mail)"; }
    static get category() { return "armor-magical"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(DemonArmor, DemonArmor.#content); }
    static get armorType() { return "heavy-armor"; }

    static get properties() {
        return [
            { name: "is-armor" },
            { name: "attunement" },
            { name: "stealth-disadvantage" },
            { name: "armor-name", value: DemonArmor.name },
            { name: "armor-title", value: DemonArmor.title },
            { name: "armor-type", value: "heavy-armor" },
            { name: "ac-modifier", value: "9" },
            { name: "strength", value: "15" }
        ];
    }

    static get displayProperties() {
        return [
            "Very rare",
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
        item.properties = DemonArmor.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${DemonArmor.name}-inventory-index-${inventoryIndex}-ac-modifier`,
                target: "armor-class",
                value: 9,
                title: DemonArmor.title
            });

            const strength = character.getAbilityScore("strength");
            if (Number(strength) < 15) {
                modifiers.push({
                    name: `${DemonArmor.name}-inventory-index-${inventoryIndex}-speed-modifier`,
                    target: "speed",
                    value: -10,
                    title: DemonArmor.title
                });
            }

            modifiers.push({
                name: `${DemonArmor.name}-inventory-index-${inventoryIndex}-language-abyssal`,
                title: "Language",
                value: { value: "abyssal", text: "Abyssal" },
                target: "language"
            });

            modifiers.push({
                name: `${DemonArmor.name}-inventory-index-${inventoryIndex}-to-hit-modifier`,
                target: "to-hit",
                value: 1,
                title: DemonArmor.title,
                conditions: [
                    {
                        name: "inventory-index",
                        values: [inventoryIndex]
                    }
                ]
            });

            modifiers.push({
                name: `${DemonArmor.name}-inventory-index-${inventoryIndex}-damage-modifier`,
                target: "damage",
                value: 1,
                title: DemonArmor.title,
                conditions: [
                    {
                        name: "inventory-index",
                        values: [inventoryIndex]
                    }
                ]
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = DemonArmor.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {

            const claws = {
                name: `${DemonArmor.name}-claws`,
                properties: [
                    { name: "title", value: "Demon Armor Claws" },
                    { name: "damage-dice", value: "1d8" },
                    { name: "damage-type", value: "slashing" },
                    { name: "light" }
                ]
            };
            tempFeatures.push(character.getWeaponAttackCard(inventoryIndex, claws));
            tempFeatures.push(character.getFeatureCard(
                `equipment-${inventoryIndex}-${DemonArmor.name}`, DemonArmor.title, DemonArmor.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = DemonArmor.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            While wearing this armor, you gain a +1 bonus to AC, and you can understand and speak Abyssal. In addition, the armor's clawed gauntlets turn unarmed strikes with your hands into magic weapons that deal slashing damage, with a +1 bonus to attack rolls and damage rolls and a damage die of 1d8.
        </p>
        <p>
            <b>Curse.</b> Once you don this cursed armor, you can't doff it unless you are targeted by the Remove Curse spell or similar magic. While wearing the armor, you have disadvantage on attack rolls against demons and on saving throws against their spells and special abilities.
        </p>
    `;
}
