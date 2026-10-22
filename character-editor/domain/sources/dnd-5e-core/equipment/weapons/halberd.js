
export class Halberd {

    static get name() {
        return "halberd";
    }

    static get title() {
        return "Halberd";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            "Cost: 20gp",
            "Damage: 1d10 slashing",
            "Heavy",
            "Reach",
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
            { name: "weapon-name", value: Halberd.name },
            { name: "weapon-type", value: "martial-melee" },
            { name: "heavy" },
            { name: "reach" },
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
                name: Halberd.name,
                title: Halberd.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 10,
                damageType: "slashing"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Halberd.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
