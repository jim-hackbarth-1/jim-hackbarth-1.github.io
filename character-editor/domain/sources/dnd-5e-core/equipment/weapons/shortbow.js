
export class Shortbow {

    static get name() {
        return "shortbow";
    }

    static get title() {
        return "Shortbow";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            "Cost: 25gp",
            "Damage: 1d6 piercing",
            "Ammunition (range 80/320)",
            "two-handed",
            "Simple ranged weapon"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex) {
        const item = character.equipment[inventoryIndex];
        item.properties = [
            { name: "weapon-name", value: Shortbow.name },
            { name: "weapon-type", value: "simple-ranged" },
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
                name: Shortbow.name,
                title: Shortbow.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 6,
                damageType: "piercing",
                range: "range 80/320 ft."
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Shortbow.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
