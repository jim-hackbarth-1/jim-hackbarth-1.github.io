
export class ClericLifeDomain {

    static get name() {
        return "cleric-life-domain";
    }

    static get title() {
        return "Life Domain";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/cleric-life-domain.html";
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
                name: `${ClericLifeDomain.name}-armor-proficiency-heavy-armor`,
                title: "Armor proficiency",
                value: "heavy-armor",
                target: "armor-proficiency"
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `subClass-${classIndex}`;
                modifier.sourcePropertyValue = ClericLifeDomain.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, classIndex) {
        const tempFeatures = [];
        const level = Number(character.classes.find(c => c.value == "cleric").level);

        // Disciple of Life
        if (level >= 1) {
            const discipleOfLifeHtml = `
               <p>
                    Your healing spells are more effective. Whenever you use a spell of 1st level or higher to restore hit points to a creature, the creature regains additional hit points equal to 2 + the spell's level.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${ClericLifeDomain.name}-disciple-of-life`, "Disciple of Life", discipleOfLifeHtml));
        }

        // Channel Divinity: Preserve Life
        if (level >= 2) {
            const preserveLifeHtml = `
                <p>
                    You can use your Channel Divinity to heal the badly injured.
                </p>
                <p>
                    As an action, you present your holy symbol and evoke healing energy that can restore ${5 * Number(level)} hit points. Choose any creatures within 30 feet of you, and divide those hit points among them. This feature can restore a creature to no more than half of its hit point maximum. You can't use this feature on an undead or a construct.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(
                `${ClericLifeDomain.name}-preserve-life`, "Channel Divinity: Preserve Life", preserveLifeHtml));
        }

        // Blessed Healer
        if (level >= 6) {
            const blessedHealerHtml = `
                <p>
                    The healing spells you cast on others heal you as well. When you cast a spell of 1st level or higher that restores hit points to a creature other than you, you regain hit points equal to 2 + the spell's level.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${ClericLifeDomain.name}-blessed-healer`, "Blessed Healer", blessedHealerHtml));
        }

        // Divine Strike
        if (level >= 8) {
            let damageDice = 1;
            if (level >= 14) {
                damageDice = 2;
            }
            const divineStrikeHtml = `
                <p>
                    You gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra ${damageDice}d8 radiant damage to the target.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${ClericLifeDomain.name}-divine-strike`, "Divine Strike", divineStrikeHtml));
        }

        // Supreme Healing
        if (level >= 17) {
            const supremeHealingHtml = `
                <p>
                    When you would normally roll one or more dice to restore hit points with a spell, you instead use the highest number possible for each die. For example, instead of restoring 2d6 hit points to a creature, you restore 12.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${ClericLifeDomain.name}-supreme-healing`, "Supreme Healing", supremeHealingHtml));
        }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `subClass-${classIndex}`;
            feature.sourcePropertyValue = ClericLifeDomain.name;
            feature.cardSource = ClericLifeDomain.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex) {
        const characterClass = character.classes.find(c => c.value == "cleric");
        const tempSpells = [];
        if (characterClass.level >= 1) {
            tempSpells.push("bless");
            tempSpells.push("cure-wounds");
        }
        if (characterClass.level >= 3) {
            tempSpells.push("lesser-restoration");
            tempSpells.push("spiritual-weapon");
        }
        if (characterClass.level >= 5) {
            tempSpells.push("beacon-of-hope");
            tempSpells.push("revivify");
        }
        if (characterClass.level >= 7) {
            tempSpells.push("death-ward");
            tempSpells.push("guardian-of-faith");
        }
        if (characterClass.level >= 9) {
            tempSpells.push("mass-cure-wounds");
            tempSpells.push("raise-dead");
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
            ClericLifeDomain.#addSpell("bless", allSpells, classSpellCastingInfo);
            ClericLifeDomain.#addSpell("cure-wounds", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 3) {
            ClericLifeDomain.#addSpell("lesser-restoration", allSpells, classSpellCastingInfo);
            ClericLifeDomain.#addSpell("spiritual-weapon", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 5) {
            ClericLifeDomain.#addSpell("beacon-of-hope", allSpells, classSpellCastingInfo);
            ClericLifeDomain.#addSpell("revivify", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 7) {
            ClericLifeDomain.#addSpell("death-ward", allSpells, classSpellCastingInfo);
            ClericLifeDomain.#addSpell("guardian-of-faith", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 9) {
            ClericLifeDomain.#addSpell("mass-cure-wounds", allSpells, classSpellCastingInfo);
            ClericLifeDomain.#addSpell("raise-dead", allSpells, classSpellCastingInfo);
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
