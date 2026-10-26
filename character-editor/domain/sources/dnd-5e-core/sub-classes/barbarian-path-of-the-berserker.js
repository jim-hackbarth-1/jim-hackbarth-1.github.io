
export class BarbarianPathOfTheBerserker {

    static get name() {
        return "barbarian-path-of-the-berserker";
    }

    static get title() {
        return "Path of the Berserker";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/barbarian-path-of-the-berserker.html";
    }

    static get className() {
        return "barbarian";
    }

    static getSelections(character, classIndex) {
        return [];
    }

    static getSelectionOptions(character, classIndex, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, classIndex, targetFilters) {

    }

    static applyFeatures(features, character, classIndex) {
        const tempFeatures = [];
        const characterClass = character.classes.find(c => c.value == "barbarian");
        if (characterClass.level >= 3) {
            // Frenzy
            tempFeatures.push({
                name: "barbarian-path-of-the-berserker-frenzy",
                title: "Frenzy",
                html: `
                    <p>
                        You can go into a frenzy when you rage. If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. When your rage ends, you suffer one level of exhaustion.
                    </p>
                `,
                source: {
                    name: "sub-class",
                    title: BarbarianPathOfTheBerserker.title
                },
                displayType: "feature-card"
            });
        }
        if (characterClass.level >= 6) {
            // Mindless Rage
            tempFeatures.push({
                name: "barbarian-path-of-the-berserker-mindless-rage",
                title: "Mindless Rage",
                html: `
                     <p>
                        You can't be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage.
                    </p>
                `,
                source: {
                    name: "sub-class",
                    title: BarbarianPathOfTheBerserker.title
                },
                displayType: "feature-card"
            });
        }
        if (characterClass.level >= 10) {

            // Intimidating Presence
            const dcModifiersList = character.getModifiers({
                target: "dc",
                relevantAbility: { name: "charisma", title: "Charisma" },
                applyAbilityModifier: true,
                applyProficiencyModifier: true
            });
            const dcModifiers = dcModifiersList
                .map(m => m.value)
                .reduce((a, b) => a + b, 0);
            const dc = 8 + Number(dcModifiers);
            tempFeatures.push({
                name: "barbarian-path-of-the-berserker-initimidating-presence",
                title: "Intimidating Presence",
                html: `
                    <p>
                        You can use your action to frighten someone with your menacing presence. When you do so, choose one creature that you can see within 30 feet of you. If the creature can see or hear you, it must succeed on a Wisdom saving throw (DC ${dc}) or be frightened of you until the end of your next turn. On subsequent turns, you can use your action to extend the duration of this effect on the frightened creature until the end of your next turn. This effect ends if the creature ends its turn out of line of sight or more than 60 feet away from you.
                    </p>
                `,
                source: {
                    name: "sub-class",
                    title: BarbarianPathOfTheBerserker.title
                },
                displayType: "feature-card"
            });
        }
        if (characterClass.level >= 14) {
            // Retaliation
            tempFeatures.push({
                name: "barbarian-path-of-the-berserker-retaliation",
                title: "Retaliation",
                html: `
                    <p>
                        When you take damage from a creature that is within 5 feet of you, you can use your reaction to make a melee weapon attack against that creature.
                    </p>
                `,
                source: {
                    name: "sub-class",
                    title: BarbarianPathOfTheBerserker.title
                },
                displayType: "feature-card"
            });
        }
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `subClass-${classIndex}`;
            feature.sourcePropertyValue = BarbarianPathOfTheBerserker.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex) {

    }

    static getSpellCastingInfo(character, allSpells, classSpellCastingInfo) {
        return classSpellCastingInfo;
    }
}
