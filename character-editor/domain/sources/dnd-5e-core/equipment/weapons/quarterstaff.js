
export class Quarterstaff {

    static get name() {
        return "quarterstaff";
    }

    static get title() {
        return "Quarterstaff";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            "Cost: 22p",
            "Damage: 1d6 bludgeoning",
            "Versatile (1d8)",
            "Simple melee weapon"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex) {
        const item = character.equipment[inventoryIndex];
        item.properties = [
            { name: "weapon-name", value: Quarterstaff.name },
            { name: "weapon-type", value: "simple-melee" },
            { name: "versatile" }
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
                name: Quarterstaff.name,
                title: Quarterstaff.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 6,
                damageType: "bludgeoning"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Quarterstaff.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
