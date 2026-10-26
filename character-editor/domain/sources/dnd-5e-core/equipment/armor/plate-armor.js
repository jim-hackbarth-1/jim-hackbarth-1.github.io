
export class PlateArmor {

    static get name() {
        return "plate-armor";
    }

    static get title() {
        return "Plate";
    }

    static get category() {
        return "armor";
    }

    static get armorType() {
        return "heavy-armor";
    }

    static get properties() {
        return [
            { name: "armor-name", value: PlateArmor.name },
            { name: "armor-title", value: PlateArmor.title },
            { name: "armor-type", value: "heavy-armor" },
            { name: "strength", value: "15" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 1,500gp",
            "Armor Class: 18",
            "Strength requirement: 15",
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
        item.properties = PlateArmor.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${PlateArmor.name}-ac-modifier`,
                target: "armor-class",
                value: 8,
                title: PlateArmor.title
            });

            const strength = character.getAbilityScore("strength");
            if (Number(strength) < 15) {
                modifiers.push({
                    name: `${PlateArmor.name}-speed-modifier`,
                    target: "speed",
                    value: -10,
                    title: PlateArmor.title
                });
            }
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = PlateArmor.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {

    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
