
export class ClericWarDomain{

    static get name() {
        return "cleric-war-domain";
    }

    static get title() {
        return "War Domain";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/cleric-war-domain.html";
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
                name: `${ClericWarDomain.name}-weapon-proficiency-martial-melee`,
                title: "Weapon proficiency",
                value: "martial-melee",
                target: "weapon-proficiency"
            });
            modifiers.push({
                name: `${ClericWarDomain.name}-weapon-proficiency-martial-ranged`,
                title: "Weapon proficiency",
                value: "martial-ranged",
                target: "weapon-proficiency"
            });
            modifiers.push({
                name: `${ClericWarDomain.name}-armor-proficiency-heavy-armor`,
                title: "Armor proficiency",
                value: "heavy-armor",
                target: "armor-proficiency"
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `subClass-${classIndex}`;
                modifier.sourcePropertyValue = ClericWarDomain.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, classIndex) {
        const tempFeatures = [];
        const level = Number(character.classes.find(c => c.value == "cleric").level);

        // War Priest
        if (level >= 1) {
            let warPriestUses = character.getAbilityScoreModifier("wisdom");
            if (warPriestUses < 1) {
                warPriestUses = 1;
            }
            const warPriestHtml = `
                <p>
                    Your god delivers bolts of inspiration to you while you are engaged in battle. When you use the Attack action, you can make one weapon attack as a bonus action.
                </p>
                <p>
                    You can use this feature a number of times equal to your Wisdom modifier (a minimum of once). You regain all expended uses when you finish a long rest.
                </p>
            `;
            const warPriest = character.getFeatureCard(`${ClericWarDomain.name}-war-priest`, "War Priest", warPriestHtml);
            warPriest.useInfo = {
                reset: "long-rest",
                uses: warPriestUses
            };
            tempFeatures.push(warPriest);
        }

        // Channel Divinity: Guided Strike
        if (level >= 2) {
            const guidedStrikeHtml = `
                <p>
                    You can use your Channel Divinity to strike with supernatural accuracy. When you make an attack roll, you can use your Channel Divinity to gain a +10 bonus to the roll. You make this choice after you see the roll, but before the DM says whether the attack hits or misses.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${ClericWarDomain.name}-guided-strike`, "Channel Divinity: Guided Strike", guidedStrikeHtml));
        }

        // Channel Divinity: War God's Blessing
        if (level >= 6) {
            const warGodsBlessingHtml = `
                <p>
                    When a creature within 30 feet of you makes an attack roll, you can use your reaction to grant that creature a +10 bonus to the roll, using your Channel Divinity. You make this choice after you see the roll, but before the DM says whether the attack hits or misses.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(
                `${ClericWarDomain.name}-war-gods-blessing`, "Channel Divinity: War God's Blessing", warGodsBlessingHtml));
        }

        // Divine Strike
        if (level >= 8) {
            let damageDice = 1;
            if (level >= 14) {
                damageDice = 2;
            }
            const divineStrikeHtml = `
                <p>
                    You gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra ${damageDice}d8 damage of the same type dealt by the weapon to the target.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${ClericWarDomain.name}-divine-strike`, "Divine Strike", divineStrikeHtml));
        }

        // Avatar of Battle
        if (level >= 17) {
            const avatarHtml = `
                <p>
                    You gain resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${ClericWarDomain.name}-avatar-of-battle`, "Avatar of Battle", avatarHtml));
        }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `subClass-${classIndex}`;
            feature.sourcePropertyValue = ClericWarDomain.name;
            feature.cardSource = ClericWarDomain.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex) {
        const characterClass = character.classes.find(c => c.value == "cleric");
        const tempSpells = [];
        if (characterClass.level >= 1) {
            tempSpells.push("divine-favor");
            tempSpells.push("shield-of-faith");
        }
        if (characterClass.level >= 3) {
            tempSpells.push("magic-weapon");
            tempSpells.push("spiritual-weapon");
        }
        if (characterClass.level >= 5) {
            tempSpells.push("crusaders-mantle");
            tempSpells.push("spirit-guardians");
        }
        if (characterClass.level >= 7) {
            tempSpells.push("freedom-of-movement");
            tempSpells.push("stoneskin");
        }
        if (characterClass.level >= 9) {
            tempSpells.push("flame-strike");
            tempSpells.push("hold-monster");
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
            ClericWarDomain.#addSpell("divine-favor", allSpells, classSpellCastingInfo);
            ClericWarDomain.#addSpell("shield-of-faith", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 3) {
            ClericWarDomain.#addSpell("magic-weapon", allSpells, classSpellCastingInfo);
            ClericWarDomain.#addSpell("spiritual-weapon", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 5) {
            ClericWarDomain.#addSpell("crusaders-mantle", allSpells, classSpellCastingInfo);
            ClericWarDomain.#addSpell("spirit-guardians", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 7) {
            ClericWarDomain.#addSpell("freedom-of-movement", allSpells, classSpellCastingInfo);
            ClericWarDomain.#addSpell("stoneskin", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 9) {
            ClericWarDomain.#addSpell("flame-strike", allSpells, classSpellCastingInfo);
            ClericWarDomain.#addSpell("hold-monster", allSpells, classSpellCastingInfo);
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
