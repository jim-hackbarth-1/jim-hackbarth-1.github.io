
export class Whip {

    static get name() {
        return "whip";
    }

    static get title() {
        return "Whip";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            "Cost: 2gp",
            "Damage: 1d4 slashing",
            "Finesse",
            "Reach",
            "Martial melee weapon"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex) {
        const item = character.equipment[inventoryIndex];
        item.properties = [
            { name: "weapon-name", value: Whip.name },
            { name: "weapon-type", value: "martial-melee" },
            { name: "finesse" },
            { name: "reach" }
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
                name: Whip.name,
                title: Whip.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 4,
                damageType: "slashing"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Whip.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
