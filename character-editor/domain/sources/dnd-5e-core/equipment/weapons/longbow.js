
export class Longbow {

    static get name() {
        return "longbow";
    }

    static get title() {
        return "Longbow";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            "Cost: 50gp",
            "Damage: 1d8 piercing",
            "Ammunition (range 150/600)",
            "heavy",
            "two-handed",
            "Martial ranged weapon"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex) {
        const item = character.equipment[inventoryIndex];
        item.properties = [
            { name: "weapon-name", value: "longbow" },
            { name: "weapon-type", value: "martial-ranged" }
        ];
        item.isEquipped = true;
    }

    static get html() {
        return "";
    }

    static getSelections(character, inventoryIndex) {
        return []
    }

    static getSelectionOptions(character, inventoryIndex, selectionName) {
        return [];
    }

    static applyModifiers(character, inventoryIndex) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            const attackCard = character.getAttackCard({
                inventoryIndex: inventoryIndex,
                title: Longbow.title,
                damageDieSize: 8,
                damageType: "piercing",
                range: "range 150/600 ft.",
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Longbow.name
            features.push(feature);
        }
    }

}
