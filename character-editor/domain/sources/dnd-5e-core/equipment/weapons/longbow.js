
export class Longbow {

    static get name() {
        return "longbow";
    }

    static get title() {
        return "Longbow";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: Longbow.name },
            { name: "weapon-title", value: Longbow.title },
            { name: "weapon-type", value: "martial-ranged" },
            { name: "damage-dice", value: "1d8" },
            { name: "damage-type", value: "piercing" },
            { name: "range", value: "150/600" },
            { name: "ammunition" },
            { name: "heavy" },
            { name: "two-handed" }
        ];

    }
    static get displayProperties() {
        return [
            "Cost: 50gp",
            "Damage: 1d8 piercing",
            "Martial ranged weapon",
            "Properties: Range 150/600, Ammunition, Heavy, Two-handed" 
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = Longbow.properties;
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
                name: Longbow.name,
                title: Longbow.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 8,
                damageType: "piercing",
                range: "range 150/600 ft."
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Longbow.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
