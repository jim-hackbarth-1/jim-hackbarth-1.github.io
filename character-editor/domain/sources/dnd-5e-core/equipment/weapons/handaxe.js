
export class Handaxe {

    static get name() {
        return "handaxe";
    }

    static get title() {
        return "Handaxe";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            "Cost: 5gp",
            "Damage: 1d6 slashing",
            "Light",
            "Thrown (range 20/60)",
            "Simple melee weapon"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex) {
        const item = character.equipment[inventoryIndex];
        item.properties = [
            { name: "weapon-name", value: Handaxe.name },
            { name: "weapon-type", value: "simple-melee" },
            { name: "light" },
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
                name: Handaxe.name,
                title: Handaxe.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 6,
                damageType: "slashing",
                range: "Thrown 20/60 ft."
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Handaxe.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
