
export class Rapier {

    static get name() {
        return "rapier";
    }

    static get title() {
        return "Rapier";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            { name: "weapon-name", value: Rapier.name },
            { name: "weapon-title", value: Rapier.title },
            { name: "weapon-type", value: "martial-melee" },
            { name: "damage-dice", value: "1d8" },
            { name: "damage-type", value: "piercing" },
            { name: "finesse" }
        ];
    }

    static get displayProperties() {
        return [
            "Cost: 25gp",
            "Damage: 1d8 piercing",
            "Martial melee weapon",
            "Properties: Finesse"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex, allEquipment) {
        const item = character.equipment[inventoryIndex];
        item.properties = Rapier.properties;
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
                name: Rapier.name,
                title: Rapier.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 8,
                damageType: "piercing"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Rapier.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
