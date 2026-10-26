
export class ScaleMailArmor {

    static get name() {
        return "scale-mail-armor";
    }

    static get title() {
        return "Scale mail";
    }

    static get category() {
        return "armor";
    }

    static get armorType() {
        return "medium-armor";
    }

    static get properties() {
        return [
            { name: "armor-name", value: ScaleMailArmor.name },
            { name: "armor-title", value: ScaleMailArmor.title },
            { name: "armor-type", value: "medium-armor" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 50gp",
            "Armor Class: 14 + Dex modifier (max 2)",
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
        item.properties = ScaleMailArmor.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${ScaleMailArmor.name}-ac-modifier`,
                target: "armor-class",
                value: 4,
                title: ScaleMailArmor.title
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = ScaleMailArmor.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {

    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
