
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Greatsword {

    static get name() { return "greatsword"; }
    static get title() { return "Greatsword"; }
    static get category() { return "weapons"; }
    static get canBeEquipped() { return true; }
    static get html() { return ""; }

    static get properties() {
        return [
            { name: "weapon-name", value: Greatsword.name },
            { name: "weapon-title", value: Greatsword.title },
            { name: "weapon-type", value: "martial-melee" },
            { name: "damage-dice", value: "2d6" },
            { name: "damage-type", value: "slashing" },
            { name: "heavy" },
            { name: "two-handed" }
        ];

    }
    static get displayProperties() {
        return [
            "Cost: 50gp",
            "Damage: 2d6 slashing",
            "Martial melee weapon",
            "Properties: Heavy, Two-handed" 
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
        item.properties = Greatsword.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getWeaponAttackCard(inventoryIndex, Greatsword));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Greatsword.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
