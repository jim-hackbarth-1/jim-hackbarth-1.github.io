
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Glaive {

    static get name() { return "glaive"; } 
    static get title() { return "Glaive"; }
    static get category() { return "weapons"; }
    static get canBeEquipped() { return true; }
    static get html() { return ""; }

    static get properties() {
        return [
            { name: "weapon-name", value: Glaive.name },
            { name: "weapon-title", value: Glaive.title },
            { name: "weapon-type", value: "martial-melee" },
            { name: "damage-dice", value: "1d10" },
            { name: "damage-type", value: "slashing" },
            { name: "heavy" },
            { name: "reach" },
            { name: "two-handed" },
            { name: "polearm" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 20gp",
            "Damage: 1d10 slashing",
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
        item.properties = Glaive.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getWeaponAttackCard(inventoryIndex, Glaive));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Glaive.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
