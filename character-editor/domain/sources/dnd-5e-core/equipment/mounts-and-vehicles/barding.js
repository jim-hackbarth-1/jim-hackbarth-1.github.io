
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Barding {

    static get name() { return "barding"; }
    static get title() { return "Barding"; }
    static get category() { return "mounts-and-vehicles"; }
    static get canBeEquipped() { return true; }
    static get html() { return DnD5ESource.getEquipmentHtml(Barding, Barding.#content); }

    static get properties() {
        return [];
    }

    static get displayProperties() {
        return ["Cost: 4x armor cost"];
    }

    static getSelections(character, inventoryIndex) {
        const selections = [];
        const item = character.equipment[inventoryIndex];
        selections.push(character.getSelection(item.selections, "armor", "Armor", 1, [{ name: "armor" }]));
        return selections;
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        let options = [];
        const item = character.equipment[inventoryIndex];
        if (selectionName == "armor") {
            let armor = [...sources.find(s => s.name == "armor").options];
            armor = armor.filter(a => !a.properties.some(p => p.name == "armor-name" && p.value == "shield"));
            const selectedValues = item.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.getSelectionOptions(armor, selectedValues, [], "Armor (choose 1) ...");
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
        let title = Barding.title;
        if (selectedArmor) {
            title = `${Barding.title} - ${selectedArmor.title}`;
        }
        item.properties = [];
        item.properties.push({ name: "title", value: title });
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getFeatureCard(
                `equipment-${inventoryIndex}-${Barding.name}`, Barding.title, Barding.#content));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Barding.name;
            feature.cardSource = "Equipment";
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

    static #content = `
        <p>
            Barding is armor designed to protect an animal's head, neck, chest, and body. Any type of armor shown on the Armor table can be purchased as barding. The cost is four times the equivalent armor made for humanoids, and it weighs twice as much.
        </p>
    `;

}
