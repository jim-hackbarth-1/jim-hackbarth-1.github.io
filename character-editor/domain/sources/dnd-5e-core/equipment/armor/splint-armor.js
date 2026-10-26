
export class SplintArmor {

    static get name() {
        return "splint-armor";
    }

    static get title() {
        return "Splint";
    }

    static get category() {
        return "armor";
    }

    static get armorType() {
        return "heavy-armor";
    }

    static get properties() {
        return [
            { name: "armor-name", value: SplintArmor.name },
            { name: "armor-title", value: SplintArmor.title },
            { name: "armor-type", value: "heavy-armor" },
            { name: "strength", value: "15" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 200gp",
            "Armor Class: 17",
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
        item.properties = SplintArmor.properties;
        item.isEquipped = true;
    }

    static applyModifiers(character, inventoryIndex, targetFilters) {
        const modifiers = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            modifiers.push({
                name: `${SplintArmor.name}-ac-modifier`,
                target: "armor-class",
                value: 7,
                title: SplintArmor.title
            });

            const strength = character.getAbilityScore("strength");
            if (Number(strength) < 15) {
                modifiers.push({
                    name: `${SplintArmor.name}-speed-modifier`,
                    target: "speed",
                    value: -10,
                    title: SplintArmor.title
                });
            }
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `equipment-${inventoryIndex}`;
                modifier.sourcePropertyValue = SplintArmor.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, inventoryIndex) {

    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
