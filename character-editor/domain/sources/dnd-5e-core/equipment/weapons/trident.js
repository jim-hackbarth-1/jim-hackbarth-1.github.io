
export class Trident {

    static get name() {
        return "trident";
    }

    static get title() {
        return "Trident";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: Trident.name },
            { name: "weapon-title", value: Trident.title },
            { name: "weapon-type", value: "martial-melee" },
            { name: "damage-dice", value: "1d6" },
            { name: "versatile-damage-dice", value: "1d8" },
            { name: "damage-type", value: "piercing" },
            { name: "range", value: "20/60" },
            { name: "thrown" },
            { name: "versatile" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 5gp",
            "Damage: 1d6 piercing",
            "Martial melee weapon",
            "Properties: Range 20/60, Thrown, Versatile (1d8)"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = Trident.properties;
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
                name: Trident.name,
                title: Trident.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 6,
                damageType: "piercing"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Trident.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
