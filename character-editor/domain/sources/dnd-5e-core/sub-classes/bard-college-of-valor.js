
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
                title: "Armor proficiency",
                value: "medium-armor",
                target: "armor-proficiency"
            });
            modifiers.push({
                name: `${BardCollegeOfValor.name}-armor-proficiency-shield`,
                title: "Armor proficiency",
                value: "shield",
                target: "armor-proficiency"
            });
            modifiers.push({
                name: `${BardCollegeOfValor.name}-weapon-proficiency-martial-melee-weapons`,
                title: "Weapon proficiency",
                value: "martial-melee",
                target: "weapon-proficiency"
            });
            modifiers.push({
                name: `${BardCollegeOfValor.name}-weapon-proficiency-martial-ranged-weapons`,
                title: "Weapon proficiency",
                value: "martial-ranged",
                target: "weapon-proficiency"
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

        // Combat Inspiration
        if (level >= 3) {
            const combatInspirationHtml = `
                <p>You learn to inspire others in battle. A creature that has a Bardic Inspiration die from you can roll that die and add the number rolled to a weapon damage roll it just made. Alternatively, when an attack roll is made against the creature, it can use its reaction to roll the Bardic Inspiration die and add the number rolled to its AC against that attack, after seeing the roll but before knowing whether it hits or misses.</p>
            `;
            tempFeatures.push(character.getFeatureCard(`${BardCollegeOfValor.name}-combat-inspiration`, "Combat inspiration", combatInspirationHtml));
        }

        //Extra Attack
        if (level >= 6) {
            const extraAttackHtml = `
                <p>You can attack twice, instead of once, whenever you take the Attack action on your turn.</p>
            `;
            tempFeatures.push(character.getFeatureCard(`${BardCollegeOfValor.name}-extra-attack`, "Extra attack", extraAttackHtml));
        }

        //Battle Magic
        if (level >= 14) {
            const battleMagicHtml = `
                <p>You have mastered the art of weaving spellcasting and weapon use into a single harmonious act. When you use your action to cast a bard spell, you can make one weapon attack as a bonus action.</p>
            `;
            tempFeatures.push(character.getFeatureCard(`${BardCollegeOfValor.name}-battle-magic`, "Battle magic", battleMagicHtml));
        }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `subClass-${classIndex}`;
            feature.sourcePropertyValue = BardCollegeOfValor.name;
            feature.cardSource = BardCollegeOfValor.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex) {

    }

    static getSpellCastingInfo(character, allSpells, classSpellCastingInfo) {
        return classSpellCastingInfo;
    }
}
