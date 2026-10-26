
export class ChainShirtArmor {

    static get name() {
        return "chain-shirt-armor";
    }

    static get title() {
        return "Chain shirt";
    }

    static get category() {
        return "armor";
    }

    static get armorType() {
        return "medium-armor";
    }

    static get properties() {
        return [
            { name: "armor-name", value: ChainShirtArmor.name },
            { name: "armor-title", value: ChainShirtArmor.title },
            { name: "armor-type", value: "medium-armor" }
        ];
    }

    static get displayProperties() {
        return ["Cost: 50gp", "Armor Class: 13 + Dex modifier (max 2)"];
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
        item.properties = ChainShirtArmor.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${ChainShirtArmor.name}-ac-modifier`,
                target: "armor-class",
                value: 3,
                title: ChainShirtArmor.title
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = ChainShirtArmor.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {

    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
