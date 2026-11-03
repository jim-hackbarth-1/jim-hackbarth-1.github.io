
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Scimitar {

    static get name() { return "scimitar"; }
    static get title() { return "Scimitar"; }
    static get category() { return "weapons"; }
    static get canBeEquipped() { return true; }
    static get html() { return ""; }

    static get properties() {
        return [
            { name: "weapon-name", value: Scimitar.name },
            { name: "weapon-title", value: Scimitar.title },
            { name: "weapon-type", value: "martial-melee" },
            { name: "damage-dice", value: "1d6" },
            { name: "damage-type", value: "slashing" },
            { name: "finesse" },
            { name: "light" }
        ];

    }
    static get displayProperties() {
        return [
            "Cost: 25gp",
            "Damage: 1d6 slashing",
            "Martial melee weapon",
            "Properties: Finesse, Light"
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
        item.properties = Scimitar.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getWeaponAttackCard(inventoryIndex, Scimitar));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Scimitar.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
