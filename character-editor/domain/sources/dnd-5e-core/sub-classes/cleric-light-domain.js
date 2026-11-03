
export class ClericLightDomain {

    static get name() {
        return "cleric-light-domain";
    }

    static get title() {
        return "Light Domain";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/cleric-light-domain.html";
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
        if (level >= 8) {
            const wisdomModifier = character.getAbilityScoreModifier("wisdom");
            modifiers.push({
                name: `${ClericLightDomain.name}-potent-spellcasting`,
                target: "damage",
                value: wisdomModifier,
                title: "Potent Spellcasting",
                conditions: [
                    { name: "spell-class", values: ["cleric"] },
                    { name: "spell-level", values: [0] }
                ]
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `subClass-${classIndex}`;
                modifier.sourcePropertyValue = ClericLightDomain.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, classIndex) {

        const tempFeatures = [];
        const level = Number(character.classes.find(c => c.value == "cleric").level);

        // Warding Flare
        if (level >= 1) {
            let wardingFlareUses = character.getAbilityScoreModifier("wisdom");
            if (wardingFlareUses < 1) {
                wardingFlareUses = 1;
            }
            const wardingFlareHtml = `
                <p>
                    You can interpose divine light between yourself and an attacking enemy. When you are attacked by a creature within 30 feet of you that you can see, you can use your reaction to impose disadvantage on the attack roll, causing light to flare before the attacker before it hits or misses. An attacker that can't be blinded is immune to this feature.
                </p>
                <p>
                    You can use this feature a number of times equal to your Wisdom modifier (a minimum of once). You regain all expended uses when you finish a long rest.
                </p>
            `;
            const wardingFlare = character.getFeatureCard(`${ClericLightDomain.name}-warding-flare`, "Warding Flare", wardingFlareHtml);
            wardingFlare.useInfo = {
                reset: "long-rest",
                uses: wardingFlareUses
            };
            tempFeatures.push(wardingFlare);
        }

        // Channel Divinity: Radiance of the Dawn
        if (level >= 2) {
            const radianceOfTheDawnHtml = `
                <p>
                    You can use your Channel Divinity to harness sunlight, banishing darkness and dealing radiant damage to your foes.
                </p>
                <p>
                    As an action, you present your holy symbol, and any magical darkness within 30 feet of you is dispelled. Additionally, each hostile creature within 30 feet of you must make a Constitution saving throw. A creature takes radiant damage equal to 2d10 + your cleric level on a failed saving throw, and half as much damage on a successful one. A creature that has total cover from you is not affected.
                </p>
            `;
            const attackInfo = character.getAttackInfo({
                target: "dc",
                attackAbility: "wisdom",
                saveAbility: "wisdom",
                damageDice: `2d10+${level}d1`,
                damageType: "radiant",
                range: "30 feet",
                notes: ["Half damage on save"]
            });
            tempFeatures.push(character.getFeatureCard(
                `${ClericLightDomain.name}-radiance-of-the-dawn`,
                "Channel Divinity: Radiance of the Dawn",
                radianceOfTheDawnHtml,
                ClericLightDomain.title,
                attackInfo));
        }

        // Improved Flare
        if (level >= 6) {
            const improvedFlareHtml = `
                <p>
                    You can also use your Warding Flare feature when a creature that you can see within 30 feet of you attacks a creature other than you.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${ClericLightDomain.name}-improved-flare`, "Improved Flare", improvedFlareHtml));
        }

        // Corona of Light
        if (level >= 17) {
            const coronaOfLightHtml = `
                <p>
                    You can use your action to activate an aura of sunlight that lasts for 1 minute or until you dismiss it using another action. You emit bright light in a 60-foot radius and dim light 30 feet beyond that. Your enemies in the bright light have disadvantage on saving throws against any spell that deals fire or radiant damage.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${ClericLightDomain.name}-corona-of-light`, "Corona of Light", coronaOfLightHtml));
        }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `subClass-${classIndex}`;
            feature.sourcePropertyValue = ClericLightDomain.name;
            feature.cardSource = ClericLightDomain.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex) {
        const characterClass = character.classes.find(c => c.value == "cleric");
        const tempSpells = [];
        if (characterClass.level >= 1) {
            tempSpells.push("light");
            tempSpells.push("burning-hands");
            tempSpells.push("faerie-fire");
        }
        if (characterClass.level >= 3) {
            tempSpells.push("flaming-sphere");
            tempSpells.push("scorching-ray");
        }
        if (characterClass.level >= 5) {
            tempSpells.push("daylight");
            tempSpells.push("fireball");
        }
        if (characterClass.level >= 7) {
            tempSpells.push("guardian-of-faith");
            tempSpells.push("wall-of-fire");
        }
        if (characterClass.level >= 9) {
            tempSpells.push("flame-strike");
            tempSpells.push("scrying");
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
            ClericLightDomain.#addSpell("burning-hands", allSpells, classSpellCastingInfo);
            ClericLightDomain.#addSpell("faerie-fire", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 3) {
            ClericLightDomain.#addSpell("flaming-sphere", allSpells, classSpellCastingInfo);
            ClericLightDomain.#addSpell("scorching-ray", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 5) {
            ClericLightDomain.#addSpell("daylight", allSpells, classSpellCastingInfo);
            ClericLightDomain.#addSpell("fireball", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 7) {
            ClericLightDomain.#addSpell("guardian-of-faith", allSpells, classSpellCastingInfo);
            ClericLightDomain.#addSpell("wall-of-fire", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 9) {
            ClericLightDomain.#addSpell("flame-strike", allSpells, classSpellCastingInfo);
            ClericLightDomain.#addSpell("scrying", allSpells, classSpellCastingInfo);
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
