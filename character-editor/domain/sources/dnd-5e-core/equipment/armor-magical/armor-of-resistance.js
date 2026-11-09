
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ArmorOfResistance {

    static get name() { return "armor-of-resistance"; }
    static get title() { return "Armor of Resistance"; }
    static get category() { return "armor-magical"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(ArmorOfResistance, ArmorOfResistance.#content); }

    static get properties() {
        return [
            { name: "is-armor" },
            { name: "attunement" }
        ];

    }
    static get displayProperties() {
        return ["Rare", "Requires attunement"];

    }

    static getSelections(character, inventoryIndex) {
        const selections = [];
        const item = character.equipment[inventoryIndex];
        selections.push(character.getSelection(item.selections, `armor`, "Armor", 1, [{ name: "armor" }]));
        selections.push(character.getSelection(item.selections, "resistance-type", "Resistance type", 1));
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
        if (selectionName == "resistance-type") {
            let resistances = [...ArmorOfResistance.#resistances];
            const selectedValues = item.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.getSelectionOptions(
                resistances, selectedValues, [], "Resistance type (choose 1) ...");
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
            item.properties = ArmorOfResistance.properties;
        }

        let title = ArmorOfResistance.title;
        if (selectedArmor) {
            title = `${selectedArmor.title} of Resistance`;
        }
        const selectedResistances = item.selections.find(s => s.name == "resistance-type")?.values ?? [];
        if (selectedResistances.length > 0 && selectedResistances[0].value) {
            title = `${title} (${selectedResistances[0].text})`;
        }
        item.properties.push({ name: "title", value: title });

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
                    name: `${ArmorOfResistance.name}-inventory-index-${inventoryIndex}-ac-modifier`,
                    target: "armor-class",
                    value: acModifier,
                    title: ArmorOfResistance.title
                });

                if (item.properties.some(p => p.name == "strength")) {
                    const strength = character.getAbilityScore("strength");
                    if (Number(strength) < 15) {
                        modifiers.push({
                            name: `${ArmorOfResistance.name}-inventory-index-${inventoryIndex}-speed-modifier`,
                            target: "speed",
                            value: -10,
                            title: ArmorOfResistance.title
                        });
                    }
                }
            }

        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = ArmorOfResistance.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            let content = "";
            const item = character.equipment[inventoryIndex];
            const selectedResistances = item.selections.find(s => s.name == "resistance-type")?.values ?? [];
            if (selectedResistances.length > 0 && selectedResistances[0].value) {
                const resistance = selectedResistances[0].value;
                content += `
                    <p>
                        While wearing this armor, you have resistance to ${resistance} damage.
                    </p>
                `;
            }
            if (content) {
                tempFeatures.push(character.getFeatureCard(ArmorOfResistance.name, ArmorOfResistance.title, content));
            }
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = ArmorOfResistance.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #resistances = [
        { name: "acid", title: "Acid" },
        { name: "cold", title: "Cold" },
        { name: "fire", title: "Fire" },
        { name: "Force", title: "Force" },
        { name: "lightning", title: "Lightning" },
        { name: "necrotic", title: "Necrotic" },
        { name: "poison", title: "Poison" },
        { name: "psychic", title: "Psychic" },
        { name: "radiant", title: "Radiant" },
        { name: "thunder", title: "Thunder" }
    ];

    static #content = `
        <p>
            You have resistance to one type of damage while you wear this armor. The DM chooses the type or determines it randomly from the options below.
            <table>
                <tr>
                    <td>d10</td>
                    <td>Damage Type</td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Acid</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Cold</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>Fire</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>Force</td>
                </tr>
                <tr>
                    <td>5</td>
                    <td>Lightning</td>
                </tr>
                <tr>
                    <td>6</td>
                    <td>Necrotic</td>
                </tr>
                <tr>
                    <td>7</td>
                    <td>Poison</td>
                </tr>
                <tr>
                    <td>8</td>
                    <td>Psychic</td>
                </tr>
                <tr>
                    <td>9</td>
                    <td>Radiant</td>
                </tr>
                <tr>
                    <td>10</td>
                    <td>Thunder</td>
                </tr>
            </table>
        </p>
    `;
}
