
export class Sickle {

    static get name() {
        return "sickle";
    }

    static get title() {
        return "Sickle";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: Sickle.name },
            { name: "weapon-title", value: Sickle.title },
            { name: "weapon-type", value: "simple-melee" },
            { name: "damage-dice", value: "1d4" },
            { name: "damage-type", value: "slashing" },
            { name: "light" }
        ];

    }
    static get displayProperties() {
        return [
            "Cost: 1gp",
            "Damage: 1d4 slashing",
            "Simple melee weapon",
            "Properties: Light"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = Sickle.properties;
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
                name: Sickle.name,
                title: Sickle.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 4,
                damageType: "slashing"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Sickle.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
