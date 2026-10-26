
export class CrossbowHeavy {

    static get name() {
        return "crossbow-heavy";
    }

    static get title() {
        return "Crossbow, Heavy";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: CrossbowHeavy.name },
            { name: "weapon-title", value: CrossbowHeavy.title },
            { name: "weapon-type", value: "martial-ranged" },
            { name: "damage-dice", value: "1d10" },
            { name: "damage-type", value: "piercing" },
            { name: "range", value: "100/400" },
            { name: "ammunition" },
            { name: "heavy" },
            { name: "loading" },
            { name: "two-handed" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 50gp",
            "Damage: 1d10 piercing",
            "Martial ranged weapon",
            "Properties: Range 100/400, Ammunition, Heavy, Loading, Two-handed"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = CrossbowHeavy.properties;
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
                name: CrossbowHeavy.name,
                title: CrossbowHeavy.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 10,
                damageType: "piercing",
                range: "range 100/400 ft."
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = CrossbowHeavy.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
