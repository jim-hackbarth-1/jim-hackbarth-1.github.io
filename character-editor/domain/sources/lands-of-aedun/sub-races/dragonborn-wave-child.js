
export class DragonbornWaveChild {

    static get name() {
        return "dragonborn-wave-child";
    }

    static get title() {
        return "Dragonborn Wave Child";
    }

    static get htmlPath() {
        return "lands-of-aedun/sub-races/dragonborn-wave-child.html";
    }

    static get race() {
        return "dragonborn";
    }

    static getOptions(character) {
        return [];
    }

    static updateFeatures(character) {
        character.removeFeature("dragonborn-ability-score-modifier-strength");
        character.removeFeature("dragonborn-ability-score-modifier-charisma");
        character.removeFeature("dragonborn-draconic-ancestry-breath-weapon");
        const dexterity = Number(character.abilityScores.find(a => a.name == 'dexterity').value);
        const strength = Number(character.abilityScores.find(a => a.name == 'strength').value);
        const biteAttackAbility = (dexterity > strength) ? "dexterity" : "strength";
        const features = [
            {
                name: "dragonborn-wave-child-ability-score-modifier-strength",
                title: DragonbornWaveChild.title,
                modifier: "ability-score:strength",
                modifierValue: 1
            },
            {
                name: "dragonborn-wave-child-ability-score-modifier-constitution",
                title: DragonbornWaveChild.title,
                modifier: "ability-score:constitution",
                modifierValue: 2
            },
            {
                name: "dragonborn-wave-child-bond-of-the-sea",
                title: "Bond of the Sea",
                text: "May breathe underwater. Swimming speed equals walking speed."
            },
            {
                name: "dragonborn-wave-child-bite",
                title: "Bite",
                featureType: "attack",
                // attackAbility: biteAttackAbility,
                // damageDice: 1,
                // damageDieSize: 6,
                // damageType: "piercing",
            },
            {
                name: "dragonborn-wave-child-kiss-of-the-deep",
                title: "Kiss of the Deep",
                text: "Upon touching a willing creature, the creature gains 2d6 hit points and the dragonborn loses hit points equal to one half of the total. Alternatively, after a successful bite attack, the creature makes a constitution save (8 + Constitution modifier + proficiency bonus). Upon a failed save, the creature takes an additional 2d6 necrotic damage and the dragonborn regains one half of the total necrotic damage. Half-damage upon a successful save. Whether touching a willing creature or attacking a foe, the effect increases to 3d6 at 6<sup>the</sup> level, 4d6 at 11<sup>the</sup> level, and 5d6 at 16<sup>the</sup> level. After using Kiss of the Deep, it can’t be used again until after completing a short or long rest."
            }
        ];
        for (const feature of features) {
            feature.sourcePropertyName = "subRace";
            feature.sourcePropertyValue = "dragonborn-wave-child";
            character.addFeature(feature);
        }
    }

}
