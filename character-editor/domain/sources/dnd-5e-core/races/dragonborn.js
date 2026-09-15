
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
        //const features = [
        //    {
        //        name: "dragonborn-ability-score-modifier-strength",
        //        featureType: "ability-score-modifier",
        //        abilityScore: "strength",
        //        modifier: 2
        //    },
        //    {
        //        name: "dragonborn-ability-score-modifier-charisma",
        //        featureType: "ability-score-modifier",
        //        abilityScore: "charisma",
        //        modifier: 1
        //    },
        //    {
        //        name: "dragonborn-language-common",
        //        featureType: "language",
        //        title: "Common"
        //    },
        //    {
        //        name: "dragonborn-language-draconic",
        //        featureType: "language",
        //        title: "Draconic"
        //    }
        //];
        //for (const feature of features) {
        //    feature.sourcePropertyName = "race";
        //    feature.sourcePropertyValue = "dragonborn";
        //    character.addFeature(feature);
        //}
    }

    //static updateOptionFeatures(character, option) {
    //    character.removeFeature("dragonborn-draconic-ancestry");
    //    character.removeFeature("dragonborn-draconic-ancestry-breath-weapon");
    //    character.removeFeature("dragonborn-draconic-ancestry-damage-resistance");
    //    let draconicAncestry = null;
    //    if (option?.name == "dragonborn-draconic-ancestry") {
    //        draconicAncestry = option.value;
    //    }
    //    if (!draconicAncestry) {
    //        return;
    //    }
    //    const draconicAncestryTitle = Dragonborn.#draconicAncestries.find(da => da.value == draconicAncestry)?.text;
    //    const breathWeaponSaveAbility = (["green", "silver", "white"].includes(draconicAncestry)) ? "constitution" : "dexterity";
    //    const breathWeaponDamageDice = Dragonborn.#getBreathWeaponDamageDice(character);
    //    const breathWeaponDamageAndResistanceType = Dragonborn.#getBreathWeaponAndResistanceType(draconicAncestry);
    //    const breathWeaponDamageArea = (["gold", "green", "red", "silver", "white"].includes(draconicAncestry)) ? "15 ft cone" : "5 by 30 ft line";
    //    const features = [];
    //    features.push({
    //        name: "dragonborn-draconic-ancestry",
    //        title: "Draconic Ancestry",
    //        sourceOptionName: "dragonborn-draconic-ancestry",
    //        featureType: "race",
    //        value: draconicAncestry,
    //        text: draconicAncestryTitle
    //    });
    //    features.push({
    //        name: "dragonborn-draconic-ancestry-breath-weapon",
    //        title: "Breath Weapon",
    //        sourceOptionName: "dragonborn-draconic-ancestry",
    //        featureType: "attack",
    //        saveDC: "8",
    //        saveModifierAbility: "constitution",
    //        addProficiency: true,
    //        saveAbility: breathWeaponSaveAbility,
    //        damageDice: breathWeaponDamageDice,
    //        damageDieSize: 6,
    //        damageType: breathWeaponDamageAndResistanceType,
    //        damageArea: breathWeaponDamageArea,
    //        restRequirement: "Use again after short or long rest."
    //    });
    //    features.push({
    //        name: "dragonborn-draconic-ancestry-damage-resistance",
    //        sourceOptionName: "dragonborn-draconic-ancestry",
    //        featureType: "damage-resistance",
    //        resistanceType: breathWeaponDamageAndResistanceType
    //    })
    //    for (const feature of features) {
    //        feature.sourcePropertyName = "race";
    //        feature.sourcePropertyValue = "dragonborn";
    //        character.addFeature(feature);
    //    }
    //}

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

    static #getBreathWeaponAndResistanceType(draconicAncestryValue) {
        let breathWeaponDamageAndResistanceType = null;
        switch (draconicAncestryValue) {
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
