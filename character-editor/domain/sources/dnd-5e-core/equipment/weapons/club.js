
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Club {

    static get name() { return "club"; }
    static get title() { return "Club"; }
    static get category() { return "weapons"; }
    static get canBeEquipped() { return true; }
    static get html() { return ""; }

    static get properties() {
        return [
            { name: "weapon-name", value: Club.name },
            { name: "weapon-title", value: Club.title },
            { name: "weapon-type", value: "simple-melee" },
            { name: "damage-dice", value: "1d4" },
            { name: "damage-type", value: "bludgeoning" },
            { name: "light" }
        ];

    }
    static get displayProperties() {
        return [
            "Cost: 1sp",
            "Damage: 1d4 bludgeoning",
            "Simple melee weapon",
            "Properties: Light"
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
        item.properties = Club.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getWeaponAttackCard(inventoryIndex, Club));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Club.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
