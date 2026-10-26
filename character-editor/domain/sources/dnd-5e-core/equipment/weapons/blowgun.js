
export class Blowgun {

    static get name() {
        return "blowgun";
    }

    static get title() {
        return "Blowgun";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: Blowgun.name },
            { name: "weapon-title", value: Blowgun.title },
            { name: "weapon-type", value: "martial-ranged" },
            { name: "damage-dice", value: "1d1" },
            { name: "damage-type", value: "piercing" },
            { name: "range", value: "25/100" },
            { name: "ammunition" },
            { name: "loading" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 10gp",
            "Damage: 1 piercing",
            "Martial ranged weapon",
            "Properties: Range 25/100, Ammunition, Loading"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = Blowgun.properties;
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
                name: Blowgun.name,
                title: Blowgun.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 1,
                damageType: "piercing",
                range: "range 25/100 ft."
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Blowgun.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
