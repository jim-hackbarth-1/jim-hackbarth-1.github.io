
export class Longsword {

    static get name() {
        return "longsword";
    }

    static get title() {
        return "Longsword";
    }

    static get category() {
        return "weapons";
    }

    static get properties() {
        return [
            "Cost: 15gp",
            "Damage: 1d8 slashing",
            "Versatile (1d10)",
            "Martial melee weapon"
        ];
    }

    static get canBeEquipped() {
        return true;
    }

    static equip(character, inventoryIndex) {
        const item = character.equipment[inventoryIndex];
        item.properties = [
            { name: "weapon-name", value: "longsword" },
            { name: "weapon-type", value: "martial-melee" },
            { name: "versatile" }
        ];
        item.isEquipped = true;
    }

    static get html() {
        return "";
    }

    static getOptions(character, inventoryIndex) {
        return [];
    }

    static applyModifiers(character, inventoryIndex) {
        
    }

    static applyFeatures(features, character, inventoryIndex) {
        const tempFeatures = [];
        const isEquipped = character.equipment[inventoryIndex].isEquipped;
        if (isEquipped) {
            const attackCard = character.getAttackCard({
                inventoryIndex: inventoryIndex,
                title: Longsword.title,
                damageDieSize: 8,
                damageType: "slashing"
            });
            tempFeatures.push(attackCard);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `equipment-${inventoryIndex}`;
            feature.sourcePropertyValue = Longsword.name
            features.push(feature);
        }
    }

}
