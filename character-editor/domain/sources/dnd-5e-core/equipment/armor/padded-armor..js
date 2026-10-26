
export class PaddedArmor {

    static get name() {
        return "padded-armor";
    }

    static get title() {
        return "Padded";
    }

    static get category() {
        return "armor";
    }

    static get armorType() {
        return "light-armor";
    }

    static get properties() {
        return [
            { name: "armor-name", value: PaddedArmor.name },
            { name: "armor-title", value: PaddedArmor.title },
            { name: "armor-type", value: "light-armor" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 5gp",
            "Armor Class: 11 + Dex modifier",
            "Stealth: Disadvantage"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static get html() {
        return "";
    }

    static getSelections(character, inventoryIndex) {
        return []
    }

    static getSelectionOptions(character, inventoryIndex, selectionName, sources) {
        return [];
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = PaddedArmor.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${PaddedArmor.name}-ac-modifier`,
                target: "armor-class",
                value: 1,
                title: PaddedArmor.title
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = PaddedArmor.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {

    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
