
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Dagger {

    static get name() { return "dagger"; } 
    static get title() { return "Dagger"; }
    static get category() { return "weapons"; }
    static get canBeEquipped() { return true; }
    static get html() { return ""; }

    static get properties() {
        return [
            { name: "weapon-name", value: Dagger.name },
            { name: "weapon-title", value: Dagger.title },
            { name: "weapon-type", value: "simple-melee" },
            { name: "damage-dice", value: "1d4" },
            { name: "damage-type", value: "piercing" },
            { name: "range", value: "20/60" },
            { name: "finesse" },
            { name: "light" },
            { name: "thrown" }
        ];

    }
    static get displayProperties() {
        return [
            "Cost: 2gp",
            "Damage: 1d4 piercing",
            "Simple melee weapon",
            "Properties: Range 20/60, Finesse, Light, Thrown"
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
        item.properties = Dagger.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            tempFeatures.push(character.getWeaponAttackCard(inventoryIndex, Dagger));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Dagger.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
