
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
        selections.push(character.selectionUtilities.getSelection(
            character.selections, `${Dragonborn.name}-draconic-ancestry`, "Draconic Ancestry", 1));
        return selections;
    }

    static getSelectionOptions(character, selectionName, sources) {
        let options = [];
        if (selectionName == "dragonborn-draconic-ancestry") {
            const draconicAncestries = [...Dragonborn.#draconicAncestries];
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.selectionUtilities.getSelectionOptions(
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
            tempFeatures.push({
                name: "draconic-ancestry",
                title: "Draconic Ancestry",
                html: `
                    <ul>
                        <li>Draconic Ancestry: ${draconicAncestry.text}</li>
                        <li>Damage resistance: ${breathWeaponDamageAndResistanceType}</li>
                    </ul>
                    `,
                source: {
                    name: "race",
                    title: Dragonborn.title
                },
                displayType: "feature-card"
            });
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

    static #getBreathWeaponFeature(character, draconicAncestry, breathWeaponDamageAndResistanceType) {
        const dcAbility = (["green", "silver", "white"].includes(draconicAncestry.value))
            ? { name: "constitution", title: "Constitution" }
            : { name: "dexterity", title: "Dexterity" };
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
        const attackCard = character.getAttackCard({
            name: "dragonborn-breath-weapon",
            title: "Breath Weapon",
            hasSavingThrow: true,
            relevantAbility: dcAbility,
            applyAbilityModifierForDamage: false,
            damageDice: [{ number: damageDice, size: 6 }],
            damageType: breathWeaponDamageAndResistanceType,
            target: areaOfEffect,
            notes: ["Half damage on save.", "Use again after a short or long rest."]
        });
        const html = "<p>" + attackCard.lines.join("</p><p>") + "</p>";
        return {
            name: attackCard.name,
            title: attackCard.title,
            html: html,
            useInfo: {
                reset: "short-rest",
                uses: 1
            },
            source: {
                name: "race",
                title: Dragonborn.title
            },
            displayType: "feature-card"
        }
    }

}
