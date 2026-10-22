
export class Morningstar {

    static get name() {
        return "morningstar";
    }

    static get title() {
        return "Morningstar";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            "Cost: 15gp",
            "Damage: 1d8 piercing",
            "Martial melee weapon"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex) {
        const item = character.equipment[inventoryIndex];
        item.properties = [
            { name: "weapon-name", value: Morningstar.name },
            { name: "weapon-type", value: "martial-melee" }
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
                name: Morningstar.name,
                title: Morningstar.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 8,
                damageType: "piercing"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Morningstar.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
