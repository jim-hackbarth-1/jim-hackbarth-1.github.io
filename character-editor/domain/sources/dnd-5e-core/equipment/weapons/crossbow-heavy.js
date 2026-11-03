
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class CrossbowHeavy {

    static get name() { return "crossbow-heavy"; }
    static get title() { return "Crossbow, Heavy"; }
    static get category() { return "weapons"; }
    static get canBeEquipped() { return true; }
    static get html() { return ""; }

    static get properties() {
        return [
            { name: "weapon-name", value: CrossbowHeavy.name },
            { name: "weapon-title", value: CrossbowHeavy.title },
            { name: "weapon-type", value: "martial-ranged" },
            { name: "damage-dice", value: "1d10" },
            { name: "damage-type", value: "piercing" },
            { name: "range", value: "100/400" },
            { name: "ammunition" },
            { name: "heavy" },
            { name: "loading" },
            { name: "two-handed" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 50gp",
            "Damage: 1d10 piercing",
            "Martial ranged weapon",
            "Properties: Range 100/400, Ammunition, Heavy, Loading, Two-handed"
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
        item.properties = CrossbowHeavy.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getWeaponAttackCard(inventoryIndex, CrossbowHeavy));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = CrossbowHeavy.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
