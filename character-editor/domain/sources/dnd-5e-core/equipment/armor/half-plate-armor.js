
export class HalfPlateArmor {

    static get name() {
        return "half-plate-armor";
    }

    static get title() {
        return "Half plate";
    }

    static get category() {
        return "armor";
    }

    static get armorType() {
        return "medium-armor";
    }

    static get properties() {
        return [
            "Cost: 750gp",
            "Armor Class: 15 + Dex modifier (max 2)",
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

    static equip(character, inventoryIndex) {
        const item = character.equipment[inventoryIndex];
        item.properties = [
            { name: "armor-name", value: HalfPlateArmor.name },
            { name: "armor-type", value: "medium-armor" }
        ];
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${HalfPlateArmor.name}-ac-modifier`,
                target: "armor-class",
                value: 5,
                title: HalfPlateArmor.title
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = HalfPlateArmor.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {

    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
