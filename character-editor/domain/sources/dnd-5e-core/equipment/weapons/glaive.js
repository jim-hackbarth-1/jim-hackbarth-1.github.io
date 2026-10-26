
export class Glaive {

    static get name() {
        return "glaive";
    }

    static get title() {
        return "Glaive";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: Glaive.name },
            { name: "weapon-title", value: Glaive.title },
            { name: "weapon-type", value: "martial-melee" },
            { name: "damage-dice", value: "1d10" },
            { name: "damage-type", value: "slashing" },
            { name: "heavy" },
            { name: "reach" },
            { name: "two-handed" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 20gp",
            "Damage: 1d10 slashing",
            "Martial melee weapon",
            "Properties: Heavy, Reach, Two-handed" 
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = Glaive.properties;
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
                name: Glaive.name,
                title: Glaive.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 10,
                damageType: "slashing"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Glaive.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
