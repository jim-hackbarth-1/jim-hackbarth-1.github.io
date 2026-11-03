
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Greatclub {

    static get name() { return "greatclub"; }
    static get title() { return "Greatclub"; }
    static get category() { return "weapons"; }
    static get canBeEquipped() { return true; }
    static get html() { return ""; }

    static get properties() {
        return [
            { name: "weapon-name", value: Greatclub.name },
            { name: "weapon-title", value: Greatclub.title },
            { name: "weapon-type", value: "simple-melee" },
            { name: "damage-dice", value: "1d8" },
            { name: "damage-type", value: "bludgeoning" },
            { name: "two-handed" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 2sp",
            "Damage: 1d8 bludgeoning",
            "Simple melee weapon",
            "Properties: Two-handed"
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
        item.properties = Greatclub.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getWeaponAttackCard(inventoryIndex, Greatclub));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Greatclub.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
