
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

    static getSelectionOptions(character, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, targetFilters) {
        character.removeModifier("dragonborn-ability-score-modifier-strength");
        character.removeModifier("dragonborn-ability-score-modifier-charisma");
        const modifiers = [
            {
                name: "dragonborn-sea-drakken-ability-score-modifier-strength",
                title: "Ability score",
                value: 1,
                target: "ability-score:strength"
            },
            {
                name: "dragonborn-sea-drakken-ability-score-modifier-constitution",
                title: "Ability score",
                value: 2,
                target: "ability-score:constitution"
            }
        ];
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = "subRace";
                modifier.sourcePropertyValue = "dragonborn-sea-drakken";
                character.addModifier(modifier);
            }
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
        const bondOfTheSeaHtml = `
            <p>May breathe underwater.  Swimming speed equals walking speed.</p>
        `;
        tempFeatures.push(character.getFeatureCard(`${DragonbornSeaDrakken.name}-bond-of-the-sea`, "Bond of the Sea", bondOfTheSeaHtml));
        
        // bite
        const dexterity = Number(character.getAbilityScore("dexterity"));
        const strength = Number(character.getAbilityScore("strength"));
        const biteAttackAbility = (dexterity > strength)
            ? "dexterity"
            : "strength";
        const biteHtml = `
            <p><b>Bite.</b> Make an attack role adding your proficiency bonus plus either Strength or Dexterity bonus.  Bite damage is 1d6 piercing, plus either Strength or Dexterity bonus.</p>
        `;
        const attackInfo = character.getAttackInfo({
            attackAbility: biteAttackAbility,
            target: "to-hit",
            damageDice: `1d6`,
            damageType: "piercing"
        });
        tempFeatures.push(character.getFeatureCard(
            `${DragonbornSeaDrakken.name}-bite`, "Sea Drakken Bite", biteHtml, DragonbornSeaDrakken.title, attackInfo));
       
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
        const kissHtml = `
            <p><b>Kiss of the Deep.</b> Upon touching a willing creature, the creature gains 2d6 hit points and the dragonborn loses hit points equal to one half of the total.  Alternatively, after a successful bite attack, the creature makes a constitution save (8 + Constitution modifier + proficiency bonus). Upon a failed save, the creature takes an additional 2d6 necrotic damage and the dragonborn regains one half of the total necrotic damage.  Half-damage upon a successful save. Whether touching a willing creature or attacking a foe, the effect increases to 3d6 at 6<sup>th</sup> level, 4d6 at 11<sup>th</sup> level, and 5d6 at 16<sup>th</sup> level.  After using Kiss of the Deep, it can’t be used again until after completing a short or long rest.</p>
        `;
        const kissAttackInfo = character.getAttackInfo({
            attackAbility: "constitution",
            saveAbility: "constitution",
            target: "dc",
            damageDice: `2d6`,
            damageType: "necrotic"
        });
        const kissFeature = character.getFeatureCard(
            `${DragonbornSeaDrakken.name}-kiss-of-the-deep`, "Kiss of the Deep", kissHtml, DragonbornSeaDrakken.title, kissAttackInfo);
        kissFeature.useInfo = {
            reset: "short-rest",
            uses: 1
        };
        tempFeatures.push(kissFeature);

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "subRace";
            feature.sourcePropertyValue = DragonbornSeaDrakken.name;
            feature.cardSource = DragonbornSeaDrakken.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character) {

    }

}
