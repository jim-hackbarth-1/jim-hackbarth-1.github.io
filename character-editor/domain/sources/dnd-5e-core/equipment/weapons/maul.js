
export class Maul {

    static get name() {
        return "maul";
    }

    static get title() {
        return "Maul";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: Maul.name },
            { name: "weapon-title", value: Maul.title },
            { name: "weapon-type", value: "martial-melee" },
            { name: "damage-dice", value: "2d6" },
            { name: "damage-type", value: "bludgeoning" },
            { name: "heavy" },
            { name: "two-handed" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 10gp",
            "Damage: 2d6 bludgeoning",
            "Martial melee weapon",
            "Properties: Heavy, Two-handed"  
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = Maul.properties;
        item.isEquipped = true;
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

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            const attackCard = character.getAttackCard({
                name: Maul.name,
                title: Maul.title,
                inventoryIndex: inventoryIndex,
                damageDice: [{ number: 2, size: 6 }],
                damageType: "bludgeoning"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Maul.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
