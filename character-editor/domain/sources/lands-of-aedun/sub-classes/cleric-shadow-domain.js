
export class ClericShadowDomain {

    static get name() {
        return "cleric-shadow-domain";
    }

    static get title() {
        return "Shadow Domain";
    }

    static get htmlPath() {
        return "lands-of-aedun/sub-classes/cleric-shadow-domain.html";
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
                name: `${ClericShadowDomain.name}-skill-proficiency-medicine`,
                title: "Skill proficiency",
                value: "medicine",
                target: "skill-proficiency"
            });
            modifiers.push({
                name: `${ClericShadowDomain.name}-skill-bonus-medicine`,
                title: "Skill modifier",
                value: 5,
                target: "skill:medicine"
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `subClass-${classIndex}`;
                modifier.sourcePropertyValue = ClericShadowDomain.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, classIndex) {

        const tempFeatures = [];
        const level = Number(character.classes.find(c => c.value == "cleric").level);

        //Shadow channeler
        if (level >= 2) {
            const shadowChannelerHtml = `
                <p>
                    You can use your Channel Divinity to draw the living closer to death’s door.  Each hostile creature within 30 feet of you must make a Constitution saving throw.  A creature takes necrotic damage equal to 2d10 + your cleric level on a failed saving throw and half as much on success.  Creatures having total cover are not affected.
                </p>
            `;
            const attackInfo = character.getAttackInfo({
                attackAbility: "wisdom",
                saveAbility: "constitution",
                target: "dc",
                damageDice: `2d10+${level}d1`,
                damageType: "necrotic",
                range: "30 feet",
                notes: ["Half damage on save"]
            });
            tempFeatures.push(character.getFeatureCard(
                `${ClericShadowDomain.name}-shadow-channeler`, "Shadow channeler", shadowChannelerHtml, ClericShadowDomain.title, attackInfo));
        }

        //Shadow ward
        if (level >= 6) {
            const shadowWardHtml = `
                <p>
                    You and creatures within 5 feet of you are resistant to necrotic damage.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${ClericShadowDomain.name}-shadow-ward`, "Shadow ward", shadowWardHtml));
        }

        //Death strike
        if (level >= 8) {
            let damageDice = 1;
            if (level >= 14) {
                damageDice = 2;
            }
            const deathStrikeHtml = `
                <p>
                    You gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra ${damageDice}d8 necrotic damage.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${ClericShadowDomain.name}-death-strike`, "Death strike", deathStrikeHtml));
        }

        //Reaper
        if (level >= 17) {
            const reaperHtml = `
                <p>
                    As an action you can cast the Finger of death spell. Once used, this feature cannot be reused until after completing a long rest.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${ClericShadowDomain.name}-reaper`, "Reaper", reaperHtml));
        }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `subClass-${classIndex}`;
            feature.sourcePropertyValue = ClericShadowDomain.name;
            feature.cardSource = ClericShadowDomain.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex) {
        const characterClass = character.classes.find(c => c.value == "cleric");
        const tempSpells = [];
        if (characterClass.level >= 1) {
            tempSpells.push("spare-the-dying");
            tempSpells.push("armor-of-agathys");
            tempSpells.push("inflict-wounds");
        }
        if (characterClass.level >= 3) {
            tempSpells.push("darkness");
            tempSpells.push("gentle-repose");
        }
        if (characterClass.level >= 5) {
            tempSpells.push("animate-dead");
            tempSpells.push("speak-with-dead");
        }
        if (characterClass.level >= 7) {
            tempSpells.push("blight");
            tempSpells.push("death-ward");
        }
        if (characterClass.level >= 9) {
            tempSpells.push("antilife-shell");
            tempSpells.push("raise-dead");
        }
        if (characterClass.level >= 17) {
            tempSpells.push("finger-of-death");
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
            ClericShadowDomain.#addSpell("armor-of-agathys", allSpells, classSpellCastingInfo);
            ClericShadowDomain.#addSpell("inflict-wounds", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 3) {
            ClericShadowDomain.#addSpell("darkness", allSpells, classSpellCastingInfo);
            ClericShadowDomain.#addSpell("gentle-repose", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 5) {
            ClericShadowDomain.#addSpell("animate-dead", allSpells, classSpellCastingInfo);
            ClericShadowDomain.#addSpell("speak-with-dead", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 7) {
            ClericShadowDomain.#addSpell("blight", allSpells, classSpellCastingInfo);
            ClericShadowDomain.#addSpell("death-ward", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 9) {
            ClericShadowDomain.#addSpell("antilife-shell", allSpells, classSpellCastingInfo);
            ClericShadowDomain.#addSpell("raise-dead", allSpells, classSpellCastingInfo);
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
