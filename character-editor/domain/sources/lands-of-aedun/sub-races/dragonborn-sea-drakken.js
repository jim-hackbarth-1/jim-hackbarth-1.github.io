
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

    static getSelectionOptions(character, optionName, sources) {
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
            .findIndex(f => f.name == "dragonborn-breath-weapon");
        if (dragonbornBreathWeaponIndex > -1 && dragonbornBreathWeaponIndex < features.length) {
            features.splice(dragonbornBreathWeaponIndex, 1);
        }
        const tempFeatures = [];

        // bond of the sea
        tempFeatures.push({
            name: "dragonborn-sea-drakken-bond-of-the-sea",
            title: "Bond of the Sea",
            html: `
                <p>May breathe underwater.  Swimming speed equals walking speed.</p>
                `,
            source: {
                name: "sub-race",
                title: DragonbornSeaDrakken.title
            },
            displayType: "feature-card"
        });
        
        // bite
        const dexterity = Number(character.getAbilityScore("dexterity"));
        const strength = Number(character.getAbilityScore("strength"));
        const biteAttackAbility = (dexterity > strength)
            ? { name: "dexterity", title: "Dexterity" }
            : { name: "strength", title: "Strength" };
        const attackCard = character.getAttackCard({
            name: "dragonborn-sea-drakken-bite-attack",
            title: "Sea Drakken Bite",
            relevantAbility: biteAttackAbility,
            damageDieSize: 6,
            damageType: "piercing",
            notes: ["Bonus action"]
        });
        tempFeatures.push(attackCard);
       
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
        const dcModifiers = character.getModifiers({
            target: "dc",
            relevantAbility: { name: "constitution", title: "Constitution" },
            applyAbilityModifier: true,
            applyProficiencyModifier: true
        });
        const dc = 8 + Number(dcModifiers);
        tempFeatures.push({
            name: "dragonborn-sea-drakken-kiss-of-the-deep",
            title: "Kiss of the Deep",
            html: `
                <p>Upon touching a willing creature, the creature gains ${damageDice}d6 hit points and the dragonborn loses hit points equal to one half of the total.</p>
                <p>Alternatively, after a successful bite attack, the creature makes a constitution save (DC ${dc}). Upon a failed save, the creature takes an additional ${damageDice}d6 necrotic damage and the dragonborn regains one half of the total necrotic damage.  Half-damage upon a successful save. </p>
                <p>After using Kiss of the Deep, it can’t be used again until after completing a short or long rest.</p>
                `,
            source: {
                name: "sub-race",
                title: DragonbornSeaDrakken.title
            },
            displayType: "feature-card"
        });

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "subRace";
            feature.sourcePropertyValue = DragonbornSeaDrakken.name
            features.push(feature);
        }
    }

}
