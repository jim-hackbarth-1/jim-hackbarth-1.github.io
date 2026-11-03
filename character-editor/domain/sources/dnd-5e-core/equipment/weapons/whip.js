
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Whip {

    static get name() { return "whip"; }
    static get title() { return "Whip"; }
    static get category() { return "weapons"; }
    static get canBeEquipped() { return true; }
    static get html() { return ""; }

    static get properties() {
        return [
            { name: "weapon-name", value: Whip.name },
            { name: "weapon-title", value: Whip.title },
            { name: "weapon-type", value: "martial-melee" },
            { name: "damage-dice", value: "1d4" },
            { name: "damage-type", value: "slashing" },
            { name: "finesse" },
            { name: "reach" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 2gp",
            "Damage: 1d4 slashing",
            "Martial melee weapon",
            "Properties: Finesse, Reach"
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
        item.properties = Whip.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getWeaponAttackCard(inventoryIndex, Whip));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Whip.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
