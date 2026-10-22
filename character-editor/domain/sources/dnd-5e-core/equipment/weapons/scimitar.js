
export class Scimitar {

    static get name() {
        return "scimitar";
    }

    static get title() {
        return "Scimitar";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            "Cost: 25gp",
            "Damage: 1d6 slashing",
            "Finesse",
            "Light",
            "Martial melee weapon"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex) {
        const item = character.equipment[inventoryIndex];
        item.properties = [
            { name: "weapon-name", value: Scimitar.name },
            { name: "weapon-type", value: "martial-melee" },
            { name: "finesse" },
            { name: "light" }
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
                name: Scimitar.name,
                title: Scimitar.title,
                inventoryIndex: inventoryIndex,
                damageDieSize: 6,
                damageType: "slashing"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Scimitar.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, inventoryIndex) {

    }

}
