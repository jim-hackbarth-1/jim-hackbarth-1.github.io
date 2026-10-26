
export class Morningstar {

    static get name() {
        return "morningstar";
    }

    static get title() {
        return "Morningstar";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: Morningstar.name },
            { name: "weapon-title", value: Morningstar.title },
            { name: "weapon-type", value: "martial-melee" },
            { name: "damage-dice", value: "1d8" },
            { name: "damage-type", value: "piercing" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 15gp",
            "Damage: 1d8 piercing",
            "Martial melee weapon"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = Morningstar.properties;
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
                name: Morningstar.name,
                title: Morningstar.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 8,
                damageType: "piercing"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Morningstar.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
