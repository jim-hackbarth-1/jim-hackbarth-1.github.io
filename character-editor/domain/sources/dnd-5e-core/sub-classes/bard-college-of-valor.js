
export class BardCollegeOfValor {

    static get name() {
        return "bard-college-of-valor";
    }

    static get title() {
        return "College of Valor";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/bard-college-of-valor.html";
    }

    static get className() {
        return "bard";
    }

    static getSelections(character, classIndex) {
        return [];
    }

    static getSelectionOptions(character, classIndex, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, classIndex, targetFilters) {
        const modifiers = [];
        const level = Number(character.classes.find(c => c.value == "bard").level);
        if (level >= 3) {
            modifiers.push({
                name: `${BardCollegeOfValor.name}-armor-proficiency-medium-armor`,
                target: "armor-proficiency",
                value: "medium-armor",
                title: BardCollegeOfValor.title
            });
            modifiers.push({
                name: `${BardCollegeOfValor.name}-armor-proficiency-shield`,
                target: "armor-proficiency",
                value: "shield",
                title: BardCollegeOfValor.title
            });
            modifiers.push({
                name: `${BardCollegeOfValor.name}-weapon-proficiency-martial-melee-weapons`,
                target: "weapon-proficiency",
                value: "martial-melee",
                title: BardCollegeOfValor.title
            });
            modifiers.push({
                name: `${BardCollegeOfValor.name}-weapon-proficiency-martial-ranged-weapons`,
                target: "weapon-proficiency",
                value: "martial-ranged",
                title: BardCollegeOfValor.title
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `subClass-${classIndex}`;
                modifier.sourcePropertyValue = BardCollegeOfValor.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, classIndex) {
        const tempFeatures = [];
        const level = Number(character.classes.find(c => c.value == "bard").level);
        if (level >= 3) {
            // Combat Inspiration
            tempFeatures.push({
                name: `${BardCollegeOfValor.name}-combat-inspiration`,
                title: "Combat inspiration",
                html: `
                    <p>You learn to inspire others in battle. A creature that has a Bardic Inspiration die from you can roll that die and add the number rolled to a weapon damage roll it just made. Alternatively, when an attack roll is made against the creature, it can use its reaction to roll the Bardic Inspiration die and add the number rolled to its AC against that attack, after seeing the roll but before knowing whether it hits or misses.</p>
                    `,
                source: {
                    name: "sub-class",
                    title: BardCollegeOfValor.title
                },
                displayType: "feature-card"
            });
        }
        if (level >= 6) {
            //Extra Attack
            tempFeatures.push({
                name: `${BardCollegeOfValor.name}-extra-attack`,
                title: "Extra attack",
                html: `
                    <p>You can attack twice, instead of once, whenever you take the Attack action on your turn.</p>
                    `,
                source: {
                    name: "sub-class",
                    title: BardCollegeOfValor.title
                },
                displayType: "feature-card"
            });
        }
        if (level >= 14) {
            //Battle Magic
            tempFeatures.push({
                name: `${BardCollegeOfValor.name}-battle-magic`,
                title: "Battle magic",
                html: `
                    <p>You have mastered the art of weaving spellcasting and weapon use into a single harmonious act. When you use your action to cast a bard spell, you can make one weapon attack as a bonus action.</p>
                    `,
                source: {
                    name: "sub-class",
                    title: BardCollegeOfValor.title
                },
                displayType: "feature-card"
            });
        }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `subClass-${classIndex}`;
            feature.sourcePropertyValue = BardCollegeOfValor.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex) {

    }
}
