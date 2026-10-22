
export class HideArmor {

    static get name() {
        return "hide-armor";
    }

    static get title() {
        return "Hide";
    }

    static get category() {
        return "armor";
    }

    static get armorType() {
        return "medium-armor";
    }

    static get properties() {
        return [
            "Cost: 10gp",
            "Armor Class: 12 + Dex modifier (max 2)"
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
            { name: "armor-name", value: HideArmor.name },
            { name: "armor-type", value: "medium-armor" }
        ];
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${HideArmor.name}-ac-modifier`,
                target: "armor-class",
                value: 2,
                title: HideArmor.title
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = HideArmor.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {

    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
