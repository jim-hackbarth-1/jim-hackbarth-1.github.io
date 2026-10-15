
export class Greataxe {

    static get name() {
        return "greataxe";
    }

    static get title() {
        return "Greataxe";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            "Cost: 30gp",
            "Damage: 1d12 slashing",
            "Heavy",
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
            { name: "weapon-name", value: Greataxe.name },
            { name: "weapon-type", value: "martial-melee" },
            { name: "heavy" },
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

    static applyModifiers(character, inventoryIndex) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            const attackCard = character.getAttackCard({
                name: Greataxe.name,
                title: Greataxe.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 12,
                damageType: "slashing"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Greataxe.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
