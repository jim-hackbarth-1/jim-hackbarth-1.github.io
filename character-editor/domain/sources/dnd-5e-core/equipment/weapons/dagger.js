
export class Dagger {

    static get name() {
        return "dagger";
    }

    static get title() {
        return "Dagger";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            "Cost: 2gp",
            "Damage: 1d4 piercing",
            "Finesse",
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
            { name: "weapon-name", value: Dagger.name },
            { name: "weapon-type", value: "simple-melee" },
            { name: "light" },
            { name: "thrown" },
            { name: "finesse" }
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
                name: Dagger.name,
                title: Dagger.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 4,
                damageType: "piercing"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Dagger.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
