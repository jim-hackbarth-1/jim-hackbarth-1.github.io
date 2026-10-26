
export class Scimitar {

    static get name() {
        return "scimitar";
    }

    static get title() {
        return "Scimitar";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: Scimitar.name },
            { name: "weapon-title", value: Scimitar.title },
            { name: "weapon-type", value: "martial-melee" },
            { name: "damage-dice", value: "1d6" },
            { name: "damage-type", value: "slashing" },
            { name: "finesse" },
            { name: "light" }
        ];

    }
    static get displayProperties() {
        return [
            "Cost: 25gp",
            "Damage: 1d6 slashing",
            "Martial melee weapon",
            "Properties: Finesse, Light"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = Scimitar.properties;
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
                name: Scimitar.name,
                title: Scimitar.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 6,
                damageType: "slashing"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Scimitar.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
