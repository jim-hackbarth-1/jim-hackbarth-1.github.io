
export class Dart {

    static get name() {
        return "dart";
    }

    static get title() {
        return "Dart";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: Dart.name },
            { name: "weapon-title", value: Dart.title },
            { name: "weapon-type", value: "simple-ranged" },
            { name: "damage-dice", value: "1d4" },
            { name: "damage-type", value: "piercing" },
            { name: "range", value: "20/60" },
            { name: "finesse" },
            { name: "thrown" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 5cp",
            "Damage: 1d4 piercing",
            "Simple ranged weapon",
            "Properties: Range 20/60, Finesse, Thrown"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = Dart.properties;
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
                name: Dart.name,
                title: Dart.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 4,
                damageType: "piercing",
                range: "range 20/60 ft."
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Dart.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
