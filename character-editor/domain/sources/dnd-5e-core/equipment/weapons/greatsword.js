
export class Greatsword {

    static get name() {
        return "greatsword";
    }

    static get title() {
        return "Greatsword";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            "Cost: 50gp",
            "Damage: 2d6 slashing",
            "Heavy",
            "Two-handed",
            "Martial melee weapon"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex) {
        const item = character.equipment[inventoryIndex];
        item.properties = [
            { name: "weapon-name", value: Longsword.name },
            { name: "weapon-type", value: "martial-melee" },
            { name: "heavy" },
            { name: "two-handed" }
        ];
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
                name: Greatsword.name,
                title: Greatsword.title,
                inventoryIndex: inventoryIndex,
                damageDice: [{ number: 2, size: 6 }],
                damageType: "slashing"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Greatsword.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
