
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Battleaxe {

    static get name() { return "battleaxe"; }
    static get title() { return "Battleaxe"; }
    static get category() { return "weapons"; }
    static get canBeEquipped() { return true; }
    static get html() { return ""; }

    static get properties() {
        return [
            { name: "weapon-name", value: Battleaxe.name },
            { name: "weapon-title", value: Battleaxe.title },
            { name: "weapon-type", value: "martial-melee" },
            { name: "damage-dice", value: "1d8" },
            { name: "versatile-damage-dice", value: "1d10" },
            { name: "damage-type", value: "slashing" },
            { name: "versatile" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 10gp",
            "Damage: 1d8 slashing",
            "Martial melee weapon",
            "Properties: Versatile 1d10"
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
        item.properties = Battleaxe.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getWeaponAttackCard(inventoryIndex, Battleaxe));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Battleaxe.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
