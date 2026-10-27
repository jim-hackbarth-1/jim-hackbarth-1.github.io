
export class Quarterstaff {

    static get name() {
        return "quarterstaff";
    }

    static get title() {
        return "Quarterstaff";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: Quarterstaff.name },
            { name: "weapon-title", value: Quarterstaff.title },
            { name: "weapon-type", value: "simple-melee" },
            { name: "damage-dice", value: "1d6" },
            { name: "versatile-damage-dice", value: "1d8" },
            { name: "damage-type", value: "bludgeoning" },
            { name: "versatile" }
        ];

    }
    static get displayProperties() {
        return [
            "Cost: 22p",
            "Damage: 1d6 bludgeoning",
            "Simple melee weapon",
            "Properties: Versatile (1d8)"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = Quarterstaff.properties;
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
            const versatileDamageDice = Quarterstaff.properties.find(p => p.name == "versatile-damage-dice").value;
            const attackCard = character.getAttackCard({
                name: Quarterstaff.name,
                title: Quarterstaff.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 6,
                damageType: "bludgeoning",
                notes: [`(${versatileDamageDice} damage two-handed)`]
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Quarterstaff.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
