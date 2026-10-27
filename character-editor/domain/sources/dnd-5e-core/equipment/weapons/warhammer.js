
export class Warhammer {

    static get name() {
        return "warhammer";
    }

    static get title() {
        return "Warhammer";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: Warhammer.name },
            { name: "weapon-title", value: Warhammer.title },
            { name: "weapon-type", value: "martial-melee" },
            { name: "damage-dice", value: "1d8" },
            { name: "versatile-damage-dice", value: "1d10" },
            { name: "damage-type", value: "bludgeoning" },
            { name: "versatile" }
        ];

    }
    static get displayProperties() {
        return [
            "Cost: 15gp",
            "Damage: 1d8 bludgeoning",
            "Martial melee weapon",
            "Properties: Versatile (1d10)"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = Warhammer.properties;
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
            const versatileDamageDice = Warhammer.properties.find(p => p.name == "versatile-damage-dice").value;
            const attackCard = character.getAttackCard({
                name: Warhammer.name,
                title: Warhammer.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 8,
                damageType: "bludgeoning",
                notes: [`(${versatileDamageDice} damage two-handed)`]
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Warhammer.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
