
export class Sling {

    static get name() {
        return "sling";
    }

    static get title() {
        return "Sling";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: Sling.name },
            { name: "weapon-title", value: Sling.title },
            { name: "weapon-type", value: "simple-ranged" },
            { name: "damage-dice", value: "1d4" },
            { name: "damage-type", value: "bludgeoning" },
            { name: "range", value: "30/120" },
            { name: "ammunition" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 1sp",
            "Damage: 1d4 bludgeoning",
            "Simple ranged weapon",
            "Properties: Range 30/120, Ammunition"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = Sling.properties;
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
                name: Sling.name,
                title: Sling.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 4,
                damageType: "bludgeoning",
                range: "range 30/120 ft."
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Sling.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
