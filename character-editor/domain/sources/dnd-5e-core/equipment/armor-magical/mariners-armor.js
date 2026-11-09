
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class MarinersArmor {

    static get name() { return "mariners-armor"; }
    static get title() { return "Mariner's Armor"; }
    static get category() { return "armor-magical"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(MarinersArmor, MarinersArmor.#content); }

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
            armor = armor.filter(a => !a.properties.some(p => p.name == "armor-name" && p.value == "shield"));
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
            item.properties = [...MarinersArmor.properties];
        }
        const armorTitle = item.properties.find(p => p.name == "armor-title")?.value;
        if (armorTitle) {
            item.properties.push({ name: "title", value: `${MarinersArmor.title} (${armorTitle})`.trim() });
        }
        else {
            item.properties.push({ name: "title", value: MarinersArmor.title });
        }
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
                let acModifier = item.properties.find(p => p.name == "ac-modifier")?.value ?? 0;
                acModifier = Number(acModifier);

                modifiers.push({
                    name: `${MarinersArmor.name}-inventory-index-${inventoryIndex}-ac-modifier`,
                    target: "armor-class",
                    value: acModifier,
                    title: MarinersArmor.title
                });

                if (item.properties.some(p => p.name == "strength")) {
                    const strength = character.getAbilityScore("strength");
                    if (Number(strength) < 15) {
                        modifiers.push({
                            name: `${MarinersArmor.name}-inventory-index-${inventoryIndex}-speed-modifier`,
                            target: "speed",
                            value: -10,
                            title: MarinersArmor.name.title
                        });
                    }
                }
            }

        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = MarinersArmor.name.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getFeatureCard(
                `equipment-${inventoryIndex}-${MarinersArmor.name}`, MarinersArmor.title, MarinersArmor.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = MarinersArmor.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            While wearing this armor, you have a swimming speed equal to your walking speed. In addition, whenever you start your turn underwater with 0 hit points, the armor causes you to rise 60 feet toward the surface. The armor is decorated with fish and shell motifs.
        </p>
    `;
}
