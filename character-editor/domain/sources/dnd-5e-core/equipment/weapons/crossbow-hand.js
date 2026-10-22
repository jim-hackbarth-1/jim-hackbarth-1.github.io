
export class CrossbowHand {

    static get name() {
        return "crossbow-hand";
    }

    static get title() {
        return "Crossbow, Hand";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            "Cost: 75gp",
            "Damage: 1d6 piercing",
            "Ammunition (range 30/120)",
            "light",
            "loading",
            "Martial ranged weapon"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex) {
        const item = character.equipment[inventoryIndex];
        item.properties = [
            { name: "weapon-name", value: CrossbowHand.name },
            { name: "weapon-type", value: "martial-ranged" },
            { name: "light" }
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
                name: CrossbowHand.name,
                title: CrossbowHand.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 6,
                damageType: "piercing",
                range: "range 30/120 ft."
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = CrossbowHand.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
