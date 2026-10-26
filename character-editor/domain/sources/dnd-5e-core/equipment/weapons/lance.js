
export class Lance {

    static get name() {
        return "lance";
    }

    static get title() {
        return "Lance";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: Lance.name },
            { name: "weapon-title", value: Lance.title },
            { name: "weapon-type", value: "martial-melee" },
            { name: "damage-dice", value: "1d12" },
            { name: "damage-type", value: "piercing" },
            { name: "reach" },
            { name: "special" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 10gp",
            "Damage: 1d12 piercing",
            "Martial melee weapon",
            "Properties: Reach, Special"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = Lance.properties;
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
                name: Lance.name,
                title: Lance.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 12,
                damageType: "piercing"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Lance.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
