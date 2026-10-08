
export class Dragonborn {

    static get name() {
        return "dragonborn";
    }

    static get title() {
        return "Dragonborn";
    }

    static get htmlPath() {
        return "dnd-5e-core/races/dragonborn.html";
    }

    static get speed() {
        return 30;
    }

    static get size() {
        return "medium";
    }

    static getSelections(character) { 
        const selectionName = "dragonborn-draconic-ancestry";
        const currentSelections = character.selections.find(s => s.name == selectionName)?.values ?? [];
        if (currentSelections.length == 0) {
            currentSelections.push({ value: null, text: "Choose a draconic ancestry ..." });
        }
        return [
            {
                name: selectionName,
                title: "Draconic Ancestry",
                maxSelections: 1,
                currentSelections: currentSelections
            }
        ];
    }

    static getSelectionOptions(character, selectionName) {
        let options = [];
        if (selectionName == "dragonborn-draconic-ancestry") {
            options = [...Dragonborn.#draconicAncestries];
            options.unshift({ value: null, text: "Choose a draconic ancestry ..." });
            let draconicAncestry = null;
            const currentSelections = character.selections.find(s => s.name == selectionName)?.values ?? [];
            if (currentSelections.length > 0) {
                draconicAncestry = currentSelections[0].value;
            }
            for (const option of options) {
                option.isSelected = (option.value == draconicAncestry);
            }
        }
        return options;
    }

    static applyModifiers(character) {
        const modifiers = [
            {
                name: "dragonborn-ability-score-modifier-strength",
                target: "ability-score:strength",
                value: 2,
                title: Dragonborn.title
            },
            {
                name: "dragonborn-ability-score-modifier-charisma",
                target: "ability-score:charisma",
                value: 1,
                title: Dragonborn.title
            },
            {
                name: "dragonborn-language-common",
                target: "language",
                value: "Common",
                title: Dragonborn.title
            },
            {
                name: "dragonborn-language-draconic",
                target: "language",
                value: "Draconic",
                title: Dragonborn.title
            }
        ];
        for (const modifier of modifiers) {
            modifier.sourcePropertyName = "race";
            modifier.sourcePropertyValue = "dragonborn";
            character.addModifier(modifier);
        }
    }

    static applyFeatures(features, character) {
        const tempFeatures = [];
        let draconicAncestry = null;
        const draconicAncestries = character.selections.find(o => o.name == "dragonborn-draconic-ancestry")?.values ?? [];
        if (draconicAncestries.length > 0) {
            draconicAncestry = draconicAncestries[0];
        }
        if (draconicAncestry) {
            const draconicAncestryTitle = Dragonborn.#draconicAncestries.find(da => da.value == draconicAncestry)?.text;
            const breathWeaponDamageAndResistanceType = Dragonborn.#getBreathWeaponAndResistanceType(draconicAncestry);
            tempFeatures.push({
                name: "dragonborn-draconic-ancestry",
                displayType: "card",
                html: `Draconic Ancestry: ${draconicAncestryTitle}`
            });
            tempFeatures.push({
                name: "dragonborn-draconic-ancestry-damage-resistance",
                displayType: "card",
                html: `Damage resistance: ${breathWeaponDamageAndResistanceType}`,
            })
            const breathWeaponFeature = Dragonborn.#getBreathWeaponFeature(
                character, draconicAncestry, breathWeaponDamageAndResistanceType);
            tempFeatures.push(breathWeaponFeature);
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "race";
            feature.sourcePropertyValue = Dragonborn.name
            features.push(feature);
        }
    }

    static #draconicAncestries = [
        { value: "black", text: "Black" },
        { value: "blue", text: "Blue" },
        { value: "brass", text: "Brass" },
        { value: "bronze", text: "Bronze" },
        { value: "copper", text: "Copper" },
        { value: "gold", text: "Gold" },
        { value: "green", text: "Green" },
        { value: "red", text: "Red" },
        { value: "silver", text: "Silver" },
        { value: "white", text: "White" }
    ];

    static #getBreathWeaponAndResistanceType(draconicAncestry) {
        let breathWeaponDamageAndResistanceType = null;
        switch (draconicAncestry) {
            case "black":
                breathWeaponDamageAndResistanceType = "acid";
                break;
            case "blue":
                breathWeaponDamageAndResistanceType = "lightning";
                break;
            case "brass":
                breathWeaponDamageAndResistanceType = "fire";
                break;
            case "bronze":
                breathWeaponDamageAndResistanceType = "lightning";
                break;
            case "copper":
                breathWeaponDamageAndResistanceType = "acid";
                break;
            case "gold":
                breathWeaponDamageAndResistanceType = "fire";
                break;
            case "green":
                breathWeaponDamageAndResistanceType = "poison";
                break;
            case "red":
                breathWeaponDamageAndResistanceType = "fire";
                break;
            case "silver":
                breathWeaponDamageAndResistanceType = "cold";
                break;
            case "white":
                breathWeaponDamageAndResistanceType = "cold";
                break;
        }
        return breathWeaponDamageAndResistanceType;
    }

    static #getBreathWeaponFeature(character, draconicAncestry, breathWeaponDamageAndResistanceType) {
        const dcAbility = (["green", "silver", "white"]
            .includes(draconicAncestry)) ? "constitution" : "dexterity";
        let damageDice = 2;
        if (character.level > 5) {
            damageDice = 3;
        }
        if (character.level > 10) {
            damageDice = 4;
        }
        if (character.level > 15) {
            damageDice = 5;
        }
        const areaOfEffect = (["gold", "green", "red", "silver", "white"]
            .includes(draconicAncestry)) ? "15 ft cone" : "5 by 30 ft line";
        const attackCard = character.getAttackCard({
            name: "dragonborn-draconic-ancestry-breath-weapon",
            title: "Breath Weapon",
            hasSavingThrow: true,
            relevantAbility: dcAbility,
            damageDice: [{ number: damageDice, size: 6 }],
            damageModifiers: 0,
            damageType: breathWeaponDamageAndResistanceType,
            onSave: "Half damage",
            range: areaOfEffect
        });
        return attackCard;
    }

}
