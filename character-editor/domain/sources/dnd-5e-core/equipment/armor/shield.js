
export class Shield {

    static get name() {
        return "shield";
    }

    static get title() {
        return "Shield";
    }

    static get category() {
        return "armor";
    }

    static get armorType() {
        return "shield";
    }

    static get properties() {
        return [
            { name: "armor-name", value: "shield" },
            { name: "armor-title", value: Shield.title },
            { name: "armor-type", value: "shield" }
        ];
    }

    static get displayProperties() {
        return ["Cost: 10gp", "Armor Class: +2"];
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
        item.properties = Shield.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: "shield-ac-modifier",
                target: "armor-class",
                value: 2,
                title: Shield.title
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = Shield.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {

    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
