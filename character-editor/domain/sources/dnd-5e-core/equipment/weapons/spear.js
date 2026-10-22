
export class Spear {

    static get name() {
        return "spear";
    }

    static get title() {
        return "Spear";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            "Cost: 1gp",
            "Damage: 1d6 piercing",
            "Versatile (1d8)",
            "Thrown (range 20/60)",
            "Simple melee weapon"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex) {
        const item = character.equipment[inventoryIndex];
        item.properties = [
            { name: "weapon-name", value: Spear.name },
            { name: "weapon-type", value: "simple-melee" },
            { name: "versatile" },
            { name: "thrown" }
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
                name: Spear.name,
                title: Spear.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 6,
                damageType: "piercing"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Spear.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
