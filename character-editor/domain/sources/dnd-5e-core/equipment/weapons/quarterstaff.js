
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Quarterstaff {

    static get name() { return "quarterstaff"; }
    static get title() { return "Quarterstaff"; }
    static get category() { return "weapons"; }
    static get canBeEquipped() { return true; }
    static get html() { return ""; }

    static get properties() {
        return [
            { name: "weapon-name", value: Quarterstaff.name },
            { name: "weapon-title", value: Quarterstaff.title },
            { name: "weapon-type", value: "simple-melee" },
            { name: "damage-dice", value: "1d6" },
            { name: "versatile-damage-dice", value: "1d8" },
            { name: "damage-type", value: "bludgeoning" },
            { name: "versatile" },
            { name: "polearm" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 2sp",
            "Damage: 1d6 bludgeoning",
            "Simple melee weapon",
            "Properties: Versatile (1d8)"
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
        item.properties = Quarterstaff.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getWeaponAttackCard(inventoryIndex, Quarterstaff));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Quarterstaff.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
