
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Spear {

    static get name() { return "spear"; }
    static get title() { return "Spear"; }
    static get category() { return "weapons"; }
    static get canBeEquipped() { return true; }
    static get html() { return ""; }

    static get properties() {
        return [
            { name: "weapon-name", value: Spear.name },
            { name: "weapon-title", value: Spear.title },
            { name: "weapon-type", value: "simple-melee" },
            { name: "damage-dice", value: "1d6" },
            { name: "versatile-damage-dice", value: "1d8" },
            { name: "damage-type", value: "piercing" },
            { name: "range", value: "20/60" },
            { name: "thrown" },
            { name: "versatile" },
            { name: "polearm" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 1gp",
            "Damage: 1d6 piercing",
            "Simple melee weapon",
            "Properties: Range 20/60, Thrown, Versatile (1d8)"
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
        item.properties = Spear.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getWeaponAttackCard(inventoryIndex, Spear));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Spear.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
