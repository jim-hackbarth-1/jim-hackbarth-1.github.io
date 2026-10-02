
import { DnD5EUtilities } from "./../dnd-5e-core-utilities.js";

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
                title: "Dragonborn strength modifier",
                modifier: "ability-score:strength",
                modifierValue: 2,
                displayStyle: "bullet"
            },
            {
                name: "dragonborn-ability-score-modifier-charisma",
                title: "Dragonborn charisma modifier",
                modifier: "ability-score:charisma",
                modifierValue: 1,
                displayStyle: "bullet"
            },
            {
                name: "dragonborn-language-common",
                title: "Languages: Common",
                modifier: "language",
                modifierValue: "Common",
                displayStyle: "none"
            },
            {
                name: "dragonborn-language-draconic",
                title: "Languages: Draconic",
                modifier: "language",
                modifierValue: "Draconic",
                displayStyle: "none"
            }
        ];
        let draconicAncestry = null;
        const draconicAncestries = character.options.find(o => o.name == "dragonborn-draconic-ancestry")?.values ?? [];
        if (draconicAncestries.length > 0) {
            draconicAncestry = draconicAncestries[0];
        }
        if (draconicAncestry) {
            const draconicAncestryTitle = Dragonborn.#draconicAncestries.find(da => da.value == draconicAncestry)?.text;
            const breathWeaponDamageAndResistanceType = Dragonborn.#getBreathWeaponAndResistanceType(draconicAncestry);
            features.push({
                name: "dragonborn-draconic-ancestry",
                title: `Draconic Ancestry: ${draconicAncestryTitle}`,
                displayStyle: "bullet"
            });
            features.push({
                name: "dragonborn-draconic-ancestry-damage-resistance",
                title: `Damage resistance: ${breathWeaponDamageAndResistanceType}`,
                displayStyle: "bullet"
            })
            const breathWeaponFeature = Dragonborn.#getBreathWeaponFeature(
                character, draconicAncestry, breathWeaponDamageAndResistanceType);
            features.push(breathWeaponFeature);         
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

        // dc
        const dcAbility = (["green", "silver", "white"]
            .includes(draconicAncestry)) ? "constitution" : "dexterity";
        const dc = 8
            + Number(character.getAbilityScoreModifier(dcAbility))
            + Number(character.getProficiencyBonus());

        // damage
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
        const onFailedSave = DnD5EUtilities.getDamageLabel(
            [{ number: damageDice, size: 6 }], 0, breathWeaponDamageAndResistanceType);

        // area of effect
        const areaOfEffect = (["gold", "green", "red", "silver", "white"]
            .includes(draconicAncestry)) ? "15 ft cone" : "5 by 30 ft line";
        
        let html = DnD5EUtilities.getSavingThrowAttackCardHtml(
            "Breath Weapon", dc, dcAbility, onFailedSave, "Half damage", areaOfEffect);
        html += "<br/><i>Use again after short or long rest.</i>";
        return {
            name: "dragonborn-draconic-ancestry-breath-weapon",
            title: "Breath Weapon",
            displayStyle: "attack-card",
            html: html
        };
    }

}
