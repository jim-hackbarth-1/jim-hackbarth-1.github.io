
export class Greatsword {

    static get name() {
        return "greatsword";
    }

    static get title() {
        return "Greatsword";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: Greatsword.name },
            { name: "weapon-title", value: Greatsword.title },
            { name: "weapon-type", value: "martial-melee" },
            { name: "damage-dice", value: "2d6" },
            { name: "damage-type", value: "slashing" },
            { name: "heavy" },
            { name: "two-handed" }
        ];

    }
    static get displayProperties() {
        return [
            "Cost: 50gp",
            "Damage: 2d6 slashing",
            "Martial melee weapon",
            "Properties: Heavy, Two-handed" 
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = Greatsword.properties;
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
                name: Greatsword.name,
                title: Greatsword.title,
                inventoryIndex: inventoryIndex,
                damageDice: [{ number: 2, size: 6 }],
                damageType: "slashing"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Greatsword.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
