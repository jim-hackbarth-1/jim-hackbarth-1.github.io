
export class RingMailArmor {

    static get name() {
        return "ring-mail-armor";
    }

    static get title() {
        return "Ring mail";
    }

    static get category() {
        return "armor";
    }

    static get armorType() {
        return "heavy-armor";
    }

    static get properties() {
        return [
            { name: "armor-name", value: RingMailArmor.name },
            { name: "armor-title", value: RingMailArmor.title },
            { name: "armor-type", value: "heavy-armor" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 30gp",
            "Armor Class: 14",
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
        item.properties = RingMailArmor.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${RingMailArmor.name}-ac-modifier`,
                target: "armor-class",
                value: 4,
                title: RingMailArmor.title
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = RingMailArmor.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {

    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
