
export class BreastPlateArmor {

    static get name() {
        return "breastplate-armor";
    }

    static get title() {
        return "Breastplate";
    }

    static get category() {
        return "armor";
    }

    static get armorType() {
        return "medium-armor";
    }

    static get properties() {
        return ["Cost: 400gp", "Armor Class: 14 + Dex modifier (max 2)"];
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
            { name: "armor-name", value: BreastPlateArmor.name },
            { name: "armor-type", value: "medium-armor" }
        ];
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${BreastPlateArmor.name}-ac-modifier`,
                target: "armor-class",
                value: 4,
                title: BreastPlateArmor.title
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = BreastPlateArmor.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {

    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
