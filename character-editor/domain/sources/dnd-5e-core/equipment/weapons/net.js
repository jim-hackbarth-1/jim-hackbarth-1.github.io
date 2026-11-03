
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Net {

    static get name() { return "net"; }
    static get title() { return "Net"; }
    static get category() { return "weapons"; }
    static get canBeEquipped() { return true; }
    static get html() { return ""; }

    static get properties() {
        return [
            { name: "weapon-name", value: Net.name },
            { name: "weapon-title", value: Net.title },
            { name: "weapon-type", value: "martial-ranged" },
            { name: "range", value: "5/15" },
            { name: "special" },
            { name: "thrown" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 1gp",
            "Damage: -",
            "Martial ranged weapon",
            "Properties: Range 5/15, Special, Thrown"
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
        item.properties = Net.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getWeaponAttackCard(inventoryIndex, Net));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Net.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
