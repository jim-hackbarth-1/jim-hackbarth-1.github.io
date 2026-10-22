
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
            "Cost: 10gp",
            "Damage: 1 piercing",
            "Ammunition (range 25/100)",
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
            { name: "weapon-name", value: Blowgun.name },
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
