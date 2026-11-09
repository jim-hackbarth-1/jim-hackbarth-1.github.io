
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class AdamantineArmor {

    static get name() { return "adamantine-armor"; }
    static get title() { return "Adamantine Armor"; }
    static get category() { return "armor-magical"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(AdamantineArmor, AdamantineArmor.#content); }

    static get properties() {
        return [
            { name: "is-armor" },
        ];

    }
    static get displayProperties() {
        return ["Uncommon"];
    }

    static getSelections(character, inventoryIndex) {
        const selections = [];
        const item = character.equipment[inventoryIndex];
        selections.push(character.getSelection(item.selections, `armor`, "Armor", 1, [{ name: "armor" }]));
        return selections;
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        let options = [];
        const item = character.equipment[inventoryIndex];
        if (selectionName == "armor") {
            let armor = [...sources.find(s => s.name == "armor").options];
            const mediumOrHeavy = ["medium-armor", "heavy-armor"];
            armor = armor.filter(a => a.properties.some(p => p.name == "armor-type" && mediumOrHeavy.includes(p.value)));
            armor = armor.filter(a => !a.properties.some(p => p.name == "armor-name" && p.value == "hide-armor"));
            const selectedValues = item.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.getSelectionOptions(
                armor, selectedValues, [], "Armor (choose 1) ...");
        }
        return options;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        let selectedArmor = null;
        const selectedValues = item.selections.find(s => s.name == "armor")?.values ?? [];
        if (selectedValues.length > 0) {
            selectedArmor = allEquipment.find(ae => ae.name == selectedValues[0].value);
        }
        item.properties = [];
        if (selectedArmor) {
            item.properties = [...selectedArmor.properties];
        }
        else {
            item.properties = AdamantineArmor.properties;
        }

        let armorTitle = item.properties.find(p => p.name == "armor-title")?.value;
        if (armorTitle) {
            armorTitle = `Adamantine ${armorTitle}`;
        }
        else {
            armorTitle = AdamantineArmor.title;
        }
        item.properties.push({ name: "title", value: armorTitle });

        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const item = character.equipment[inventoryIndex];
        if (item.isEquipped) {

            let armorName = null;
            const selectedValues = item.selections.find(s => s.name == "armor")?.values ?? [];
            if (selectedValues.length > 0) {
                armorName = selectedValues[0].value;
            }

            if (armorName) {
                const name = `adamantine-${armorName}`;
                const acModifier = item.properties.find(p => p.name == "ac-modifier")?.value ?? 0;

                modifiers.push({
                    name: `${name}-inventory-index-${inventoryIndex}-ac-modifier`,
                    target: "armor-class",
                    value: acModifier,
                    title: AdamantineArmor.title
                });

                if (item.properties.some(p => p.name == "strength")) {
                    const strength = character.getAbilityScore("strength");
                    if (Number(strength) < 15) {
                        modifiers.push({
                            name: `${name}-inventory-index-${inventoryIndex}-speed-modifier`,
                            target: "speed",
                            value: -10,
                            title: AdamantineArmor.title
                        });
                    }
                }
            }

        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = AdamantineArmor.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getFeatureCard(
                `equipment-${inventoryIndex}-${AdamantineArmor.name}`, AdamantineArmor.title, AdamantineArmor.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = AdamantineArmor.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any critical hit against you becomes a normal hit.
        </p>
    `;
}
