
export class Greatclub {

    static get name() {
        return "greatclub";
    }

    static get title() {
        return "Greatclub";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            "Cost: 2sp",
            "Damage: 1d8 bludgeoning",
            "Two-handed",
            "Simple melee weapon"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex) {
        const item = character.equipment[inventoryIndex];
        item.properties = [
            { name: "weapon-name", value: Greatclub.name },
            { name: "weapon-type", value: "simple-melee" },
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
                name: Greatclub.name,
                title: Greatclub.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 8,
                damageType: "bludgeoning"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Greatclub.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
