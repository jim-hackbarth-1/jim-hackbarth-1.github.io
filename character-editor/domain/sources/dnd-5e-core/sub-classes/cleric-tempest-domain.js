
export class ClericTempestDomain {

    static get name() {
        return "cleric-tempest-domain";
    }

    static get title() {
        return "Tempest Domain";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/cleric-tempest-domain.html";
    }

    static get className() {
        return "cleric";
    }

    static getSelections(character, classIndex) {
        return [];
    }

    static getSelectionOptions(character, classIndex, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, classIndex, targetFilters) {
        const modifiers = [];
        const level = Number(character.classes.find(c => c.value == "cleric").level);
        if (level >= 1) {
            modifiers.push({
                name: `${ClericTempestDomain.name}-weapon-proficiency-martial-melee`,
                title: "Weapon proficiency",
                value: "martial-melee",
                target: "weapon-proficiency"
            });
            modifiers.push({
                name: `${ClericTempestDomain.name}-weapon-proficiency-martial-ranged`,
                title: "Weapon proficiency",
                value: "martial-ranged",
                target: "weapon-proficiency"
            });
            modifiers.push({
                name: `${ClericTempestDomain.name}-armor-proficiency-heavy-armor`,
                title: "Armor proficiency",
                value: "heavy-armor",
                target: "armor-proficiency"
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `subClass-${classIndex}`;
                modifier.sourcePropertyValue = ClericTempestDomain.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, classIndex) {
        const tempFeatures = [];
        const level = Number(character.classes.find(c => c.value == "cleric").level);

        // Wrath of the Storm
        if (level >= 1) {
            let wrathOfTheStormUses = character.getAbilityScoreModifier("wisdom");
            if (wrathOfTheStormUses < 1) {
                wrathOfTheStormUses = 1;
            }
            const wrathOfTheStormHtml = `
                <p>
                    You can thunderously rebuke attackers. When a creature within 5 feet of you that you can see hits you with an attack, you can use your reaction to cause the creature to make a Dexterity saving throw. The creature takes 2d8 lightning or thunder damage (your choice) on a failed saving throw, and half as much damage on a successful one.
                </p>
                <p>
                    You can use this feature a number of times equal to your Wisdom modifier (a minimum of once). You regain all expended uses when you finish a long rest.
                </p>
            `;
            const attackInfo = character.getAttackInfo({
                target: "dc",
                attackAbility: "wisdom",
                saveAbility: "dexterity",
                damageDice: "2d8",
                damageType: "lightning or thunder",
                notes: ["Reaction", "Half damage on save"]
            });
            const wrathOfTheStorm = character.getFeatureCard(
                `${ClericTempestDomain.name}-wrath-of-the-storm`, "Wrath of the Storm", wrathOfTheStormHtml, ClericTempestDomain.title, attackInfo);
            wrathOfTheStorm.useInfo = {
                reset: "long-rest",
                uses: wrathOfTheStormUses
            };
            tempFeatures.push(wrathOfTheStorm);
        }

        // Channel Divinity: Destructive Wrath
        if (level >= 2) {
            const destructiveWrathHtml = `
                <p>
                    You can use your Channel Divinity to wield the power of the storm with unchecked ferocity.
                </p>
                <p>
                    When you roll lightning or thunder damage, you can use your Channel Divinity to deal maximum damage, instead of rolling.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(
                `${ClericTempestDomain.name}-destructive-wrath`, "Channel Divinity: Destructive Wrath", destructiveWrathHtml));
        }

        // Thunderous Strike
        if (level >= 6) {
            const thunderousStrikeHtml = `
                <p>
                    When you deal lightning damage to a Large or smaller creature, you can also push it up to 10 feet away from you.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${ClericTempestDomain.name}-thunderous-strike`, "Thunderous Strike", thunderousStrikeHtml));
        }

        // Divine Strike
        if (level >= 8) {
            let damageDice = 1;
            if (level >= 14) {
                damageDice = 2;
            }
            const divineStrikeHtml = `
                <p>
                    You gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra ${damageDice}d8 thunder damage to the target.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${ClericTempestDomain.name}-divine-strike`, "Divine Strike", divineStrikeHtml));
        }

        // Stormborn
        if (level >= 17) {
            const stormbornHtml = `
                <p>
                    You have a flying speed equal to your current walking speed whenever you are not underground or indoors.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${ClericTempestDomain.name}-stormborn`, "Stormborn", stormbornHtml));
        }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `subClass-${classIndex}`;
            feature.sourcePropertyValue = ClericTempestDomain.name;
            feature.cardSource = ClericTempestDomain.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex) {
        const characterClass = character.classes.find(c => c.value == "cleric");
        const tempSpells = [];
        if (characterClass.level >= 1) {
            tempSpells.push("fog-cloud");
            tempSpells.push("thunderwave");
        }
        if (characterClass.level >= 3) {
            tempSpells.push("gust-of-wind");
            tempSpells.push("shatter");
        }
        if (characterClass.level >= 5) {
            tempSpells.push("call-lightning");
            tempSpells.push("sleet-storm");
        }
        if (characterClass.level >= 7) {
            tempSpells.push("control-water");
            tempSpells.push("ice-storm");
        }
        if (characterClass.level >= 9) {
            tempSpells.push("destructive-wave");
            tempSpells.push("insect-plague");
        }
        for (const spell of tempSpells) {
            spells.push(spell);
        }
    }

    static getSpellCastingInfo(character, allSpells, classSpellCastingInfo) {
        if (!classSpellCastingInfo) {
            return classSpellCastingInfo;
        }
        const characterClass = character.classes.find(c => c.value == "cleric");
        if (characterClass.level >= 1) {
            ClericTempestDomain.#addSpell("fog-cloud", allSpells, classSpellCastingInfo);
            ClericTempestDomain.#addSpell("thunderwave", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 3) {
            ClericTempestDomain.#addSpell("gust-of-wind", allSpells, classSpellCastingInfo);
            ClericTempestDomain.#addSpell("shatter", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 5) {
            ClericTempestDomain.#addSpell("call-lightning", allSpells, classSpellCastingInfo);
            ClericTempestDomain.#addSpell("sleet-storm", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 7) {
            ClericTempestDomain.#addSpell("control-water", allSpells, classSpellCastingInfo);
            ClericTempestDomain.#addSpell("ice-storm", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 9) {
            ClericTempestDomain.#addSpell("destructive-wave", allSpells, classSpellCastingInfo);
            ClericTempestDomain.#addSpell("insect-plague", allSpells, classSpellCastingInfo);
        }
        return classSpellCastingInfo;
    }

    static #addSpell(spellName, allSpells, classSpellCastingInfo) {
        const spell = allSpells.find(s => s.name == spellName);
        const spellLevel = classSpellCastingInfo.spellLevels.find(sl => sl.level == spell.level);
        if (spellLevel) {
            if (!spellLevel.spells) {
                spellLevel.spells = [];
            }
            let foundSpell = spellLevel.spells.find(s => s.title == spell.title);
            if (foundSpell) {
                foundSpell.alwaysPrepared = true;
            }
            else {
                spellLevel.spells.push({ title: spell.title, alwaysPrepared: true });
            }
        }
    }
}
