
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Shortbow {

    static get name() { return "shortbow"; }
    static get title() { return "Shortbow"; }
    static get category() { return "weapons"; }
    static get canBeEquipped() { return true; }
    static get html() { return ""; }

    static get properties() {
        return [
            { name: "weapon-name", value: Shortbow.name },
            { name: "weapon-title", value: Shortbow.title },
            { name: "weapon-type", value: "simple-ranged" },
            { name: "damage-dice", value: "1d6" },
            { name: "damage-type", value: "piercing" },
            { name: "range", value: "80/320" },
            { name: "ammunition" },
            { name: "two-handed" }
        ];

    }
    static get displayProperties() {
        return [
            "Cost: 25gp",
            "Damage: 1d6 piercing",
            "Simple ranged weapon",
            "Properties: Range 80/320, Ammunition, Two-handed"
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
        item.properties = Shortbow.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getWeaponAttackCard(inventoryIndex, Shortbow));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Shortbow.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
