
export class ClericTrickeryDomain {

    static get name() {
        return "cleric-trickery-domain";
    }

    static get title() {
        return "Trickery Domain";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/cleric-trickery-domain.html";
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

    }

    static applyFeatures(features, character, classIndex) {

        const tempFeatures = [];
        const level = Number(character.classes.find(c => c.value == "cleric").level);

        // Blessing of the Trickster
        if (level >= 1) {
            const tricksterHtml = `
                <p>
                    You can use your action to touch a willing creature other than yourself to give it advantage on Dexterity (Stealth) checks. This blessing lasts for 1 hour or until you use this feature again.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(
                `${ClericTrickeryDomain.name}-blessing-of-the-trickster`, "Blessing of the Trickster", tricksterHtml));
        }

        // Channel Divinity: Invoke Duplicity
        if (level >= 2) {
            const duplicityHtml = `
                <p>
                    You can use your Channel Divinity to create an illusory duplicate of yourself.
                </p>
                <p>
                    As an action, you create a perfect illusion of yourself that lasts for 1 minute, or until you lose your concentration (as if you were concentrating on a spell). The illusion appears in an unoccupied space that you can see within 30 feet of you. As a bonus action on your turn, you can move the illusion up to 30 feet to a space you can see, but it must remain within 120 feet of you.
                </p>
                <p>
                    For the duration, you can cast spells as though you were in the illusion's space, but you must use your own senses. Additionally, when both you and your illusion are within 5 feet of a creature that can see the illusion, you have advantage on attack rolls against that creature, given how distracting the illusion is to the target.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(
                `${ClericTrickeryDomain.name}-invoke-duplicity`, "Channel Divinity: Invoke Duplicity", duplicityHtml));
        }

        // Channel Divinity: Cloak of Shadows
        if (level >= 6) {
            const cloakOfShadowsHtml = `
                <p>
                    You can use your Channel Divinity to vanish.
                </p>
                <p>
                    As an action, you become invisible until the end of your next turn. You become visible if you attack or cast a spell.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(
                `${ClericTrickeryDomain.name}-cloak-of-shadows`, "Channel Divinity: Cloak of Shadows", cloakOfShadowsHtml));
        }

        // Divine Strike
        if (level >= 8) {
            let damageDice = 1;
            if (level >= 14) {
                damageDice = 2;
            }
            const divineStrikeHtml = `
                <p>
                    You gain the ability to infuse your weapon strikes with poison – a gift from your deity. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra ${damageDice}d8 poison damage to the target.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${ClericTrickeryDomain.name}-divine-strike`, "Divine Strike", divineStrikeHtml));
        }

        // Improved Duplicity
        if (level >= 17) {
            const improvedDuplicityHtml = `
                <p>
                    You can create up to four duplicates of yourself, instead of one, when you use Invoke Duplicity. As a bonus action on your turn, you can move any number of them up to 30 feet, to a maximum range of 120 feet.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${ClericTrickeryDomain.name}-improved-duplicity`, "Improved Duplicity", improvedDuplicityHtml));
        }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `subClass-${classIndex}`;
            feature.sourcePropertyValue = ClericTrickeryDomain.name;
            feature.cardSource = ClericTrickeryDomain.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex) {
        const characterClass = character.classes.find(c => c.value == "cleric");
        const tempSpells = [];
        if (characterClass.level >= 1) {
            tempSpells.push("charm-person");
            tempSpells.push("disguise-self");
        }
        if (characterClass.level >= 3) {
            tempSpells.push("mirror-image");
            tempSpells.push("pass-without-trace");
        }
        if (characterClass.level >= 5) {
            tempSpells.push("blink");
            tempSpells.push("dispel-magic");
        }
        if (characterClass.level >= 7) {
            tempSpells.push("dimension-door");
            tempSpells.push("polymorph");
        }
        if (characterClass.level >= 9) {
            tempSpells.push("dominate-person");
            tempSpells.push("modify-memory");
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
            ClericTrickeryDomain.#addSpell("charm-person", allSpells, classSpellCastingInfo);
            ClericTrickeryDomain.#addSpell("disguise-self", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 3) {
            ClericTrickeryDomain.#addSpell("mirror-image", allSpells, classSpellCastingInfo);
            ClericTrickeryDomain.#addSpell("pass-without-trace", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 5) {
            ClericTrickeryDomain.#addSpell("blink", allSpells, classSpellCastingInfo);
            ClericTrickeryDomain.#addSpell("dispel-magic", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 7) {
            ClericTrickeryDomain.#addSpell("dimension-door", allSpells, classSpellCastingInfo);
            ClericTrickeryDomain.#addSpell("polymorph", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 9) {
            ClericTrickeryDomain.#addSpell("dominate-person", allSpells, classSpellCastingInfo);
            ClericTrickeryDomain.#addSpell("modify-memory", allSpells, classSpellCastingInfo);
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
