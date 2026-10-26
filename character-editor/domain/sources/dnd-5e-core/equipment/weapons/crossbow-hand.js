
export class CrossbowHand {

    static get name() {
        return "crossbow-hand";
    }

    static get title() {
        return "Crossbow, Hand";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: CrossbowHand.name },
            { name: "weapon-title", value: CrossbowHand.title },
            { name: "weapon-type", value: "martial-ranged" },
            { name: "damage-dice", value: "1d6" },
            { name: "damage-type", value: "piercing" },
            { name: "range", value: "30/120" },
            { name: "ammunition" },
            { name: "light" },
            { name: "loading" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 75gp",
            "Damage: 1d6 piercing",
            "Martial ranged weapon",
            "Properties: Range 30/120, Ammunition, Light, Loading"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = CrossbowHand.properties;
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
                name: CrossbowHand.name,
                title: CrossbowHand.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 6,
                damageType: "piercing",
                range: "range 30/120 ft."
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = CrossbowHand.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
