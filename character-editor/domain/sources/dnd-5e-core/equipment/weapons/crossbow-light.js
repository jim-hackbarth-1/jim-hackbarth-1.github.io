
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class CrossbowLight {

    static get name() { return "crossbow-light"; }
    static get title() { return "Crossbow, Light"; }
    static get category() { return "weapons"; }
    static get canBeEquipped() { return true; }
    static get html() { return ""; }

    static get properties() {
        return [
            { name: "weapon-name", value: CrossbowLight.name },
            { name: "weapon-title", value: CrossbowLight.title },
            { name: "weapon-type", value: "simple-ranged" },
            { name: "damage-dice", value: "1d8" },
            { name: "damage-type", value: "piercing" },
            { name: "range", value: "80/320" },
            { name: "ammunition" },
            { name: "loading" },
            { name: "two-handed" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 25gp",
            "Damage: 1d8 piercing",
            "Simple ranged weapon",
            "Properties: Range 80/320, Ammunition, Loading, Two-handed"
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
        item.properties = CrossbowLight.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getWeaponAttackCard(inventoryIndex, CrossbowLight));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = CrossbowLight.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
