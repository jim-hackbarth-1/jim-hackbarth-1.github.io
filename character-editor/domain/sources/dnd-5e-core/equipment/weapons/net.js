
export class Net {

    static get name() {
        return "net";
    }

    static get title() {
        return "Net";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: Net.name },
            { name: "weapon-title", value: Net.title },
            { name: "weapon-type", value: "martial-ranged" },
            { name: "range", value: "5/15" },
            { name: "special" },
            { name: "thrown" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 1gp",
            "Damage: -",
            "Martial ranged weapon",
            "Properties: Range 5/15, Special, Thrown"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = Net.properties;
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
                name: Net.name,
                title: Net.title,
                inventoryIndex: inventoryIndex,
                range: "range 5/15 ft."
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Net.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
