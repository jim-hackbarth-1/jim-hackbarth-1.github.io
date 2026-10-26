
export class LightHammer {

    static get name() {
        return "light-hammer";
    }

    static get title() {
        return "Light hammer";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            "Cost: 2gp",
            "Damage: 1d4 bludgeoning",
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

    static applyModifiers(character, inventoryIndex, targetFilters) {

    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            const attackCard = character.getAttackCard({
                name: LightHammer.name,
                title: LightHammer.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 4,
                damageType: "bludgeoning"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = LightHammer.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
