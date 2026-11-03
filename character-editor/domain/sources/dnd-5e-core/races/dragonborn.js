
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
        const selections = [];
        selections.push(character.getSelection(
            character.selections, `${Dragonborn.name}-draconic-ancestry`, "Draconic Ancestry", 1));
        return selections;
    }

    static getSelectionOptions(character, selectionName, sources) {
        let options = [];
        if (selectionName == "dragonborn-draconic-ancestry") {
            const draconicAncestries = [...Dragonborn.#draconicAncestries];
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.getSelectionOptions(
                draconicAncestries, selectedValues, [], "Draconic Ancestry (choose 1) ...");
        }
        return options;
    }

    static applyModifiers(character, targetFilters) {
        const modifiers = [
            {
                name: "dragonborn-ability-score-modifier-strength",
                title: "Ability score",
                value: 2,
                target: "ability-score:strength"
            },
            {
                name: "dragonborn-ability-score-modifier-charisma",
                title: "Ability score",
                value: 1,
                target: "ability-score:charisma"
            },
            {
                name: "dragonborn-language-common",
                title: "Language",
                value: { value: "common", text: "Common" },
                target: "language"
            },
            {
                name: "dragonborn-language-draconic",
                title: "Language",
                value: { value: "draconic", text: "Draconic" },
                target: "language"
            }
        ];
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = "race";
                modifier.sourcePropertyValue = "dragonborn";
                character.addModifier(modifier);
            }
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
            const breathWeaponDamageAndResistanceType = Dragonborn.#getBreathWeaponAndResistanceType(draconicAncestry);

            // draconic ancestry
            const draconicAncestryHtml = `
                <ul>
                    <li>Draconic Ancestry: ${draconicAncestry.text}</li>
                    <li>Damage resistance: ${breathWeaponDamageAndResistanceType}</li>
                </ul>
            `;
            tempFeatures.push(
                character.getFeatureCard(`${Dragonborn.name}-draconic-ancestry`, "Draconic Ancestry", draconicAncestryHtml));

            // breath weapon
            const breathWeaponFeature = Dragonborn.#getBreathWeaponFeature(
                character, draconicAncestry, breathWeaponDamageAndResistanceType);
            tempFeatures.push(breathWeaponFeature);

            // damage resistance
            const damageResistanceHtml = `
                <p>
                    <b>Damage Resistance</b>
                    You have resistance to ${breathWeaponDamageAndResistanceType} damage.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(
                `${Dragonborn.name}-damage-resistance`, "Damage Resistance", damageResistanceHtml));
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "race";
            feature.sourcePropertyValue = Dragonborn.name;
            feature.cardSource = Dragonborn.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character) {

    }

    static #draconicAncestries = [
        { name: "black", title: "Black" },
        { name: "blue", title: "Blue" },
        { name: "brass", title: "Brass" },
        { name: "bronze", title: "Bronze" },
        { name: "copper", title: "Copper" },
        { name: "gold", title: "Gold" },
        { name: "green", title: "Green" },
        { name: "red", title: "Red" },
        { name: "silver", title: "Silver" },
        { name: "white", title: "White" }
    ];

    static #getBreathWeaponAndResistanceType(draconicAncestry) {
        let breathWeaponDamageAndResistanceType = null;
        switch (draconicAncestry.value) {
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

    static #getBreathWeaponFeature(character, draconicAncestry, damageType) {
        const saveAbility = (["green", "silver", "white"].includes(draconicAncestry.value))
            ? "constitution"
            : "dexterity";
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
            .includes(draconicAncestry.name)) ? "15 ft cone" : "5 by 30 ft line";
        const breathWeaponHtml = `
            <p>
                <b>Breath Weapon</b>
                You can use your action to exhale destructive energy. Your draconic ancestry determines the size, shape, and damage type of the exhalation. When you use your breath weapon, each creature in the area of the exhalation must make a saving throw, the type of which is determined by your draconic ancestry. The DC for this saving throw equals 8 + your Constitution modifier + your proficiency bonus. A creature takes 2d6 damage on a failed save, and half as much damage on a successful one. The damage increases to 3d6 at 6<sup>th</sup> level, 4d6 at 11<sup>th</sup> level, and 5d6 at 16<sup>th</sup> level. After you use your breath weapon, you can’t use it again until you complete a short or long rest.
            </p>
        `;
        const attackInfo = character.getAttackInfo({
            attackAbility: "constitution",
            saveAbility: saveAbility,
            target: "dc",
            damageDice: `${damageDice}d6`,
            damageType: damageType,
            range: areaOfEffect,
            notes: ["Half damage on save"]
        });
        return character.getFeatureCard(
            `${Dragonborn.name}-breath-weapon`, "Breath weapon", breathWeaponHtml, Dragonborn.title, attackInfo);
    }

}
