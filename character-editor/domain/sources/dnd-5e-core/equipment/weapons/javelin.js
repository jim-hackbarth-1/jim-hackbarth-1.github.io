
export class Javelin {

    static get name() {
        return "javelin";
    }

    static get title() {
        return "Javelin";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            "Cost: 5sp",
            "Damage: 1d6 piercing",
            "Thrown (range 30/120)",
            "Simple melee weapon"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex) {
        const item = character.equipment[inventoryIndex];
        item.properties = [
            { name: "weapon-name", value: Javelin.name },
            { name: "weapon-type", value: "simple-melee" },
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

    static applyAbilityScoreModifiers(character, inventoryIndex) {

    }

    static applyModifiers(character, inventoryIndex) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            const attackCard = character.getAttackCard({
                name: Javelin.name,
                title: Javelin.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 6,
                damageType: "piercing",
                range: "Thrown 30/120 ft."
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Javelin.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
