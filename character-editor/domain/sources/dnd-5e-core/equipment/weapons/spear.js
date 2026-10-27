
export class Spear {

    static get name() {
        return "spear";
    }

    static get title() {
        return "Spear";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: Spear.name },
            { name: "weapon-title", value: Spear.title },
            { name: "weapon-type", value: "simple-melee" },
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
            "Cost: 1gp",
            "Damage: 1d6 piercing",
            "Simple melee weapon",
            "Properties: Range 20/60, Thrown, Versatile (1d8)"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = Spear.properties;
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
            const versatileDamageDice = Spear.properties.find(p => p.name == "versatile-damage-dice").value;
            const attackCard = character.getAttackCard({
                name: Spear.name,
                title: Spear.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 6,
                damageType: "piercing",
                notes: [`(${versatileDamageDice} damage two-handed)`]
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Spear.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
