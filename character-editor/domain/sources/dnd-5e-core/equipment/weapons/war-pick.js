
export class WarPick {

    static get name() {
        return "war-pick";
    }

    static get title() {
        return "War pick";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: WarPick.name },
            { name: "weapon-title", value: WarPick.title },
            { name: "weapon-type", value: "martial-melee" },
            { name: "damage-dice", value: "1d8" },
            { name: "damage-type", value: "piercing" }
        ];

    }
    static get displayProperties() {
        return [
            "Cost: 5gp",
            "Damage: 1d8 piercing",
            "Martial melee weapon"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = WarPick.properties;
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
                name: WarPick.name,
                title: WarPick.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 8,
                damageType: "piercing"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = WarPick.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
