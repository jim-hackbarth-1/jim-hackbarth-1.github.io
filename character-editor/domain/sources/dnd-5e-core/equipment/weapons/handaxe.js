
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
            { name: "weapon-name", value: Handaxe.name },
            { name: "weapon-title", value: Handaxe.title },
            { name: "weapon-type", value: "simple-melee" },
            { name: "damage-dice", value: "1d6" },
            { name: "damage-type", value: "slashing" },
            { name: "range", value: "20/60" },
            { name: "light" },
            { name: "thrown" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 5gp",
            "Damage: 1d6 slashing",
            "Simple melee weapon",
            "Properties: Range 20/60, Light, Thrown"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = Handaxe.properties;
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
