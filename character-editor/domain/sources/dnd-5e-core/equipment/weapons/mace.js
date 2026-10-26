
export class Mace {

    static get name() {
        return "mace";
    }

    static get title() {
        return "Mace";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: Mace.name },
            { name: "weapon-title", value: Mace.title },
            { name: "weapon-type", value: "simple-melee" },
            { name: "damage-dice", value: "1d6" },
            { name: "damage-type", value: "bludgeoning" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 5gp",
            "Damage: 1d6 bludgeoning",
            "Simple melee weapon"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = Mace.properties;
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
                name: Mace.name,
                title: Mace.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 6,
                damageType: "bludgeoning"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Mace.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
