
export class StuddedLeatherArmor {

    static get name() {
        return "studded-leather-armor";
    }

    static get title() {
        return "Studded leather";
    }

    static get category() {
        return "armor";
    }

    static get armorType() {
        return "light-armor";
    }

    static get properties() {
        return [
            "Cost: 45gp",
            "Armor Class: 12 + Dex modifier"
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
            { name: "armor-name", value: StuddedLeatherArmor.name },
            { name: "armor-type", value: "light-armor" }
        ];
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${StuddedLeatherArmor.name}-ac-modifier`,
                target: "armor-class",
                value: 2,
                title: StuddedLeatherArmor.title
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = StuddedLeatherArmor.name;
                character.addModifier(modifier);
            } 
        }
    }

    static applyFeatures(features, character, inventoryIndex) {

    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
