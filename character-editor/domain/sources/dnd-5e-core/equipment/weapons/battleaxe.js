
export class Battleaxe {

    static get name() {
        return "battleaxe";
    }

    static get title() {
        return "Battleaxe";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: Battleaxe.name },
            { name: "weapon-title", value: Battleaxe.title },
            { name: "weapon-type", value: "martial-melee" },
            { name: "damage-dice", value: "1d8" },
            { name: "versatile-damage-dice", value: "1d10" },
            { name: "damage-type", value: "slashing" },
            { name: "versatile" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 10gp",
            "Damage: 1d8 slashing",
            "Martial melee weapon",
            "Properties: Versatile 1d10"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = Battleaxe.properties;
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
                name: Battleaxe.name,
                title: Battleaxe.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 8,
                damageType: "slashing"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Battleaxe.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
