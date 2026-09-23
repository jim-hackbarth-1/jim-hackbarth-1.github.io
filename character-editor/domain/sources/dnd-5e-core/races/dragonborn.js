
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

    static getOptions(character) { 
        const optionName = "dragonborn-draconic-ancestry";
        const optionValues = [...Dragonborn.#draconicAncestries];
        optionValues.unshift({ value: null, text: "Choose a draconic ancestry ..." });
        let draconicAncestry = null;
        const values = character.options.find(f => f.name == optionName)?.values ?? [];
        if (values.length > 0) {
            draconicAncestry = values[0];
        }
        for (const optionValue of optionValues) {
            optionValue.isSelected = (optionValue.value == draconicAncestry);
        }
        return [
            {
                name: optionName,
                title: "Draconic Ancestry",
                maxSelections: 1,
                optionValues: optionValues
            }
        ];
    }

    static updateFeatures(character) {
        const features = [
            {
                name: "dragonborn-ability-score-modifier-strength",
                title: Dragonborn.title,
                modifier: "ability-score:strength",
                modifierValue: 2
            },
            {
                name: "dragonborn-ability-score-modifier-charisma",
                title: Dragonborn.title,
                modifier: "ability-score:charisma",
                modifierValue: 1
            },
            {
                name: "dragonborn-language-common",
                modifier: "language",
                text: "Common"
            },
            {
                name: "dragonborn-language-draconic",
                modifier: "language",
                text: "Draconic"
            }
        ];
        let draconicAncestry = null;
        const draconicAncestryOption = character.options.find(o => o.name == "dragonborn-draconic-ancestry");
        if (draconicAncestryOption) {
            draconicAncestry = draconicAncestryOption.values[0];
        }
        if (draconicAncestry) {
            const draconicAncestryTitle = Dragonborn.#draconicAncestries.find(da => da.value == draconicAncestry)?.text;
            const breathWeaponSaveAbility = (["green", "silver", "white"].includes(draconicAncestry)) ? "constitution" : "dexterity";
            const breathWeaponDamageDice = Dragonborn.#getBreathWeaponDamageDice(character);
            const breathWeaponDamageAndResistanceType = Dragonborn.#getBreathWeaponAndResistanceType(draconicAncestry);
            const breathWeaponDamageArea = (["gold", "green", "red", "silver", "white"].includes(draconicAncestry)) ? "15 ft cone" : "5 by 30 ft line";
            features.push({
                name: "dragonborn-draconic-ancestry",
                title: "Draconic Ancestry",
                text: draconicAncestryTitle
            });
            features.push({
                name: "dragonborn-draconic-ancestry-breath-weapon",
                title: "Breath Weapon",
                featureType: "attack",
                // saveDC: "8",
                // saveModifierAbility: "constitution",
                // addProficiency: true,
                // saveAbility: breathWeaponSaveAbility,
                // damageDice: breathWeaponDamageDice,
                // damageDieSize: 6,
                // damageType: breathWeaponDamageAndResistanceType,
                // damageArea: breathWeaponDamageArea,
                // restRequirement: "Use again after short or long rest."
            });
            features.push({
                name: "dragonborn-draconic-ancestry-damage-resistance",
                title: "Damage resistance",
                text: breathWeaponDamageAndResistanceType
            })
        }
        for (const feature of features) {
           feature.sourcePropertyName = "race";
           feature.sourcePropertyValue = "dragonborn";
           character.addFeature(feature);
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

    static #getBreathWeaponDamageDice(character) {
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
        return damageDice;
    }

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
}
