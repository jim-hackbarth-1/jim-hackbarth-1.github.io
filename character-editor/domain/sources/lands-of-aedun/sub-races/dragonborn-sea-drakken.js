
export class DragonbornSeaDrakken {

    static get name() {
        return "dragonborn-sea-drakken";
    }

    static get title() {
        return "Dragonborn Sea Drakken";
    }

    static get htmlPath() {
        return "lands-of-aedun/sub-races/dragonborn-sea-drakken.html";
    }

    static get race() {
        return "dragonborn";
    }

    static getSelections(character) {
        return [];
    }

    static getSelectionOptions(character, optionName) {
        return [];
    }

    static applyModifiers(character) {
        character.removeModifier("dragonborn-ability-score-modifier-strength");
        character.removeModifier("dragonborn-ability-score-modifier-charisma");
        const modifiers = [
            {
                name: "dragonborn-sea-drakken-ability-score-modifier-strength",
                target: "ability-score:strength",
                value: 1,
                title: DragonbornSeaDrakken.title
            },
            {
                name: "dragonborn-sea-drakken-ability-score-modifier-constitution",
                target: "ability-score:constitution",
                value: 2,
                title: DragonbornSeaDrakken.title
            }
        ];
        for (const modifier of modifiers) {
            modifier.sourcePropertyName = "subRace";
            modifier.sourcePropertyValue = "dragonborn-sea-drakken";
            character.addModifier(modifier);
        }
    }

    static applyFeatures(features, character) {
        const dragonbornBreathWeaponIndex = features
            .findIndex(f => f.name == "dragonborn-draconic-ancestry-breath-weapon");
        if (dragonbornBreathWeaponIndex > -1 && dragonbornBreathWeaponIndex < features.length) {
            features.splice(dragonbornBreathWeaponIndex, 1);
        }
        const tempFeatures = [];

        // bond of the sea
        tempFeatures.push({
            name: "dragonborn-sea-drakken-bond-of-the-sea",
            displayType: "card",
            html: `
                <h3>Bond of the Sea.</h3>
                <p>May breathe underwater.  Swimming speed equals walking speed.</p>`,
        });
        
        // bite
        const dexterity = Number(character.getAbilityScore("dexterity"));
        const strength = Number(character.getAbilityScore("strength"));
        const biteAttackAbility = (dexterity > strength) ? "dexterity" : "strength";
        const biteAttackCard = character.getAttackCard({
            name: "dragonborn-sea-drakken-bite-attack",
            title: "Sea Drakken Bite",
            damageDieSize: 6,
            damageType: "piercing",
            relevantAbility: biteAttackAbility
        });
        tempFeatures.push(biteAttackCard);
       
        // kiss of the deep
        let damageDice = 2;
        if (character.level >= 6) {
            damageDice++;
        }
        if (character.level >= 11) {
            damageDice++;
        }
        if (character.level >= 16) {
            damageDice++;
        }
        const dc = 8
            + Number(character.getAbilityScoreModifier("constitution"))
            + Number(character.getProficiencyBonus());
        const kissAttackCard = character.getAttackCard({
            name: "dragonborn-sea-drakken-kiss-of-the-deep-attack",
            title: "Kiss of the Deep",
            damageDice: [{ number: damageDice, size: 6 }],
            damageType: "necrotic",
            relevantAbility: biteAttackAbility,
            dc: dc,
            onFailedSave: "Half damage"
        });
        tempFeatures.push(kissAttackCard);

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "subRace";
            feature.sourcePropertyValue = DragonbornSeaDrakken.name
            features.push(feature);
        }
    }

}
