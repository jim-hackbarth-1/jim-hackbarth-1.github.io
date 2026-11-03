
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Pike {

    static get name() { return "pike"; }
    static get title() { return "Pike"; }
    static get category() { return "weapons"; }
    static get canBeEquipped() { return true; }
    static get html() { return ""; }

    static get properties() {
        return [
            { name: "weapon-name", value: Pike.name },
            { name: "weapon-title", value: Pike.title },
            { name: "weapon-type", value: "martial-melee" },
            { name: "damage-dice", value: "1d10" },
            { name: "damage-type", value: "piercing" },
            { name: "heavy" },
            { name: "reach" },
            { name: "two-handed" }
        ];

    }
    static get displayProperties() {
        return [
            "Cost: 5gp",
            "Damage: 1d10 piercing",
            "Martial melee weapon",
            "Properties: Heavy, Reach, Two-handed" 
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
        item.properties = Pike.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getWeaponAttackCard(inventoryIndex, Pike));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Pike.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
