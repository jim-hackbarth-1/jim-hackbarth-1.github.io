
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class PotionOfResistance {

    static get name() { return "potion-of-resistance"; }
    static get title() { return "Potion of Resistance"; }
    static get category() { return "potions"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(PotionOfResistance, PotionOfResistance.#content); }
    static get properties() { return []; }
    static get displayProperties() { return ["Uncommon"]; }

    static getSelections(character, inventoryIndex) {
        const selections = [];
        const item = character.equipment[inventoryIndex];
        selections.push(character.getSelection(item.selections, "damage-type", "Damage type", 1));
        return selections;
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        let options = [];
        const item = character.equipment[inventoryIndex];
        if (selectionName == "damage-type") {
            let damageTypes = [...PotionOfResistance.#damageTypes];
            const selectedValues = item.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.getSelectionOptions(damageTypes, selectedValues, [], "Damage type (choose 1) ...");
        }
        return options;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = [...PotionOfResistance.properties];
        let title = PotionOfResistance.title;
        const selectedDamageTypes = item.selections.find(s => s.name == "damage-type")?.values ?? [];
        if (selectedDamageTypes.length > 0 && selectedDamageTypes[0].value) {
            title = `${title} (${selectedDamageTypes[0].text})`;
        }
        item.properties.push({ name: "title", value: title });
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            const item = character.equipment[inventoryIndex];
            let damageType = null;
            const values = item.selections.find(s => s.name == "damage-type")?.values ?? [];
            if (values.length > 0) {
                damageType = values[0];
            }
            let name = PotionOfResistance.name;
            if (damageType?.value) {
                name = `${PotionOfResistance.name}-${damageType.value}`;
            }
            let title = PotionOfResistance.title;
            if (damageType?.value) {
                title = `${PotionOfResistance.title} - ${damageType.text}`;
            }
            let content = PotionOfResistance.#content;
            if (damageType?.value) {
                content = `
                <p>
                    When you drink this potion, you gain resistance to ${damageType.text} damage for 1 hour.
                </p>
            `;
            }
            tempFeatures.push(character.getFeatureCard(name, title, content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = PotionOfResistance.name;
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            When you drink this potion, you gain resistance to one type of damage for 1 hour. The DM chooses the type or determines it randomly from the options below.
        </p>
        <p>
            <table>
                <tr>
                    <td>d10</td>
                    <td>Damage type</td>
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

    static #damageTypes = [
        { name: "acid", title: "Acid" },
        { name: "cold", title: "Cold" },
        { name: "fire", title: "Fire" },
        { name: "force", title: "Force" },
        { name: "lightning", title: "Lightning" },
        { name: "necrotic", title: "Necrotic" },
        { name: "poison", title: "Poison" },
        { name: "psychic", title: "Psychic" },
        { name: "radiant", title: "Radiant" },
        { name: "thunder", title: "Thunder" }
    ];

}
