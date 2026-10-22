
export class Shortsword {

    static get name() {
        return "shortsword";
    }

    static get title() {
        return "Shortsword";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            "Cost: 10gp",
            "Damage: 1d6 piercing",
            "Finesse",
            "Light",
            "Martial melee weapon"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex) {
        const item = character.equipment[inventoryIndex];
        item.properties = [
            { name: "weapon-name", value: Shortsword.name },
            { name: "weapon-type", value: "martial-melee" },
            { name: "finesse" },
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
                name: Shortsword.name,
                title: Shortsword.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 6,
                damageType: "piercing"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Shortsword.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
