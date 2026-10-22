
export class Trident {

    static get name() {
        return "trident";
    }

    static get title() {
        return "Trident";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            "Cost: 5gp",
            "Damage: 1d6 piercing",
            "Versatile (1d8)",
            "Thrown (range 20/60)",
            "Martial melee weapon"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex) {
        const item = character.equipment[inventoryIndex];
        item.properties = [
            { name: "weapon-name", value: Trident.name },
            { name: "weapon-type", value: "martial-melee" },
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
                name: Trident.name,
                title: Trident.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 6,
                damageType: "piercing"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Trident.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
