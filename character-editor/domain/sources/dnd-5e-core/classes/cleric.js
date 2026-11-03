
export class Cleric {

    static get name() {
        return "cleric";
    }

    static get title() {
        return "Cleric";
    }

    static get htmlPath() {
        return "dnd-5e-core/classes/cleric.html";
    }

    static get hitDieSize() {
        return 8;
    }

    static getMulticlassEligibility(character) {
        const wisdom = Number(character.getAbilityScore("wisdom"));
        if (wisdom >= 13) {
            return {
                isEligible: true,
                ineligibilityReason: null
            };
        }
        return {
            isEligible: false,
            ineligibilityReason: "Wisdom >= 13 required"
        };
    }

    static get subClassTitle() {
        return "Divine Domain";
    }

    static get subClassLevel() {
        return 1;
    }

    static getSelections(character, classIndex) {
        let selections = [];
        const level = Number(character.classes.find(c => c.value == Cleric.name).level);
        if (level >= 1) {
            selections.push(character.getSelection(
                character.selections, `${Cleric.name}-skills`, "Skills", 2, [{ name: "skills" }]));
        }
        for (let i = 1; i <= 20; i++) {
            if (level >= i) {
                const cantripCount = Cleric.#getCantripCount(i);
                const spellCount = Cleric.#getSpellCount(i);
                selections.push(character.getSpellSelection(
                    i, classIndex, cantripCount, spellCount, false));
            }
        }
        return selections;
    }

    static getSelectionOptions(character, classIndex, selectionName, sources) {
        if (selectionName == `${Cleric.name}-skills`) {
            return Cleric.#getSkillSelectionOptions(character, sources);
        }
        for (let i = 1; i <= 20; i++) {
            let selectionNames = [
                `${Cleric.name}-level-${i}-cantrips`,
                `${Cleric.name}-level-${i}-spells`,
                `${Cleric.name}-level-${i}-replaced-spell`,
                `${Cleric.name}-level-${i}-replacement-spell`
            ]
            if (selectionNames.includes(selectionName)) {
                const cantripCount = Cleric.#getCantripCount(i);
                const spellCount = Cleric.#getSpellCount(i);
                return character.getSpellSelectionOptions(
                    i, classIndex, selectionName, sources, cantripCount, spellCount);
            }
        }
        return [];
    }

    static applyModifiers(character, classIndex, targetFilters) {
        const modifiers = [];
        const level = Number(character.classes.find(c => c.value == Cleric.name).level);
        if (level < 1) {
            character.removeSelection(`${Cleric.name}-skills`);
        }
        for (let i = level + 1; i <= 20; i++) {
            character.removeSelection(`${Cleric.name}-level-${i}-cantrips`);
            character.removeSelection(`${Cleric.name}-level-${i}-spells`);
        }
        if (level >= 1) {
            modifiers.push({
                name: `${Cleric.name}-spell-casting-class`,
                title: "Spell casting class",
                value: `${Cleric.name}:wisdom`,
                target: "spell-casting-class"
            });
            modifiers.push({
                name: `${Cleric.name}-armor-proficiency-light-armor`,
                title: "Armor proficiency",
                value: "light-armor",
                target: "armor-proficiency"
            });
            modifiers.push({
                name: `${Cleric.name}-armor-proficiency-medium-armor`,
                title: "Armor proficiency",
                value: "medium-armor",
                target: "armor-proficiency"
            });
            modifiers.push({
                name: `${Cleric.name}-armor-proficiency-shield`,
                title: "Armor proficiency",
                value: "shield",
                target: "armor-proficiency"
            });

            if (character.classes[0].value == Cleric.name) {
                modifiers.push({
                    name: `${Cleric.name}-weapon-type-proficiency-simple-melee`,
                    title: "Weapon proficiency",
                    value: "simple-melee",
                    target: "weapon-proficiency"
                });
                modifiers.push({
                    name: `${Cleric.name}-weapon-type-proficiency-simple-ranged`,
                    title: "Weapon proficiency",
                    value: "simple-ranged",
                    target: "weapon-proficiency"
                });
                modifiers.push({
                    name: `${Cleric.name}-saving-throw-proficiency-wisdom`,
                    title: "Saving throw proficiency: Wisdom",
                    value: "wisdom",
                    target: "saving-throw-proficiency"
                });
                modifiers.push({
                    name: `${Cleric.name}-saving-throw-proficiency-charisma`,
                    title: "Saving throw proficiency: Charisma",
                    value: "charisma",
                    target: "saving-throw-proficiency"
                });

                const skillProficiencies = character.selections.find(s => s.name == `${Cleric.name}-skills`)?.values ?? [];
                for (const skillProficiency of skillProficiencies) {
                    modifiers.push({
                        name: `${Cleric.name}-skill-proficiency-${skillProficiency.value}`,
                        title: "Skill proficiency",
                        value: skillProficiency.value,
                        target: "skill-proficiency"
                    });
                }
            }
        }

        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `class-${classIndex}`;
                modifier.sourcePropertyValue = Cleric.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, classIndex) {
        const tempFeatures = [];
        const level = Number(character.classes.find(c => c.value == Cleric.name).level);

        // Channel Divinity
        if (level >= 2) {
            let channelDivinityUses = 1;
            if (level >= 6) {
                channelDivinityUses = 2;
            }
            if (level >= 18) {
                channelDivinityUses = 2;
            }
            const channelDivinityUseLabel = (channelDivinityUses == 1) ? "1 time" : `${channelDivinityUses} times`;
            const channelDivinityHtml = `
                <p>
                    You gain the ability to channel divine energy directly from your deity, using that energy to fuel magical effects.
                </p>
                <p>
                    When you use your Channel Divinity, you choose which effect to create. You must then finish a short or long rest to use your Channel Divinity again.
                </p>
                <p>
                    You can use your Channel Divinity ${channelDivinityUseLabel} between short rests.
                </p>
            `;
            const channelDivinity = character.getFeatureCard(`${Cleric.name}-channel-divinity`, "Channel Divinity", channelDivinityHtml);
            channelDivinity.useInfo = {
                reset: "short-rest",
                uses: channelDivinityUses
            };
            tempFeatures.push(channelDivinity);
        }

        // Channel Divinity: Turn Undead
        if (level >= 2) {
            const turnUndeadHtml = `
                <p>
                    As an action, you present your holy symbol and speak a prayer censuring the undead. Each undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes any damage.
                </p>
                <p>
                    A turned creature must spend its turns trying to move as far away from you as it can, and it can’t willingly move to a space within 30 feet of you. It also can’t take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there’s nowhere to move, the creature can use the Dodge action.
                </p>
            `;
            const turnUndeadAttackInfo = character.getAttackInfo({ target: "dc", attackAbility: "wisdom", saveAbility: "wisdom" });
            tempFeatures.push(character.getFeatureCard(
                `${Cleric.name}-channel-divinity-turn-undead`, "Channel Divinity: Turn Undead", turnUndeadHtml, Cleric.title, turnUndeadAttackInfo));
        }

        // Destroy Undead
        if (level >= 5) {
            let crLabel = "1/2 or lower";
            if (level >= 8) {
                crLabel = "1 or lower";
            }
            if (level >= 11) {
                crLabel = "2 or lower";
            }
            if (level >= 14) {
                crLabel = "3 or lower";
            }
            if (level >= 17) {
                crLabel = "4 or lower";
            }
            const destroyUndeadHtml = `
                <p>
                    When an undead fails its saving throw against your Turn Undead feature, the creature is instantly destroyed if its challenge rating is ${crLabel}.
                </p>
            `;
            const destroyUndeadAttackInfo = character.getAttackInfo({ target: "dc", attackAbility: "wisdom", saveAbility: "wisdom" });
            tempFeatures.push(character.getFeatureCard(
                `${Cleric.name}-channel-divinity-destroy-undead`, "Channel Divinity: Destroy Undead", destroyUndeadHtml, Cleric.title, destroyUndeadAttackInfo));
        }

        // Divine Intervention
        if (level >= 10) {
            let noRoll = "";
            if (level == 20) {
                noRoll = `
                    <p>
                        Your call for intervention succeeds automatically, no roll required.
                    </p>
                `;
            }
            const divineInterventionHtml = `
                <p>
                    You can call on your deity to intervene on your behalf when your need is great.
                </p>
                <p>
                    Imploring your deity’s aid requires you to use your action. Describe the assistance you seek, and roll percentile dice. If you roll a number equal to or lower than your cleric level, your deity intervenes. The DM chooses the nature of the intervention; the effect of any cleric spell or cleric domain spell would be appropriate.
                </p>
                <p>
                    If your deity intervenes, you can’t use this feature again for 7 days. Otherwise, you can use it again after you finish a long rest.
                </p>
                ${noRoll}
            `;
            tempFeatures.push(character.getFeatureCard(`${Cleric.name}-divine-intervention`, "Divine Intervention", divineInterventionHtml));
        }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `class-${classIndex}`;
            feature.sourcePropertyValue = Cleric.name;
            feature.cardSource = Cleric.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex) {
        const spellSelectionInfo = character.getSpellSelectionInfo(Cleric.name);
        const replacedSpells = [];
        const selectedSpells = spellSelectionInfo
            .filter(i => !i.isReplacedSpellSelection && !replacedSpells.includes(i.spell.value))
            .map(i => i.spell.value);
        for (const spell of selectedSpells) {
            spells.push(spell);
        }
    }

    static getSpellCastingInfo(character, allSpells) {
        const level = Number(character.classes.find(c => c.value == Cleric.name).level);
        if (!level) {
            return null;
        }
        const maxSpellLevel = Cleric.#getMaxSpellLevel(level);
        const spellSelectionInfo = character.getSpellSelectionInfo(Cleric.name);
        const replacedSpells = [];
        let selectedSpells = spellSelectionInfo
            .filter(i => !i.isReplacedSpellSelection && !replacedSpells.includes(i.spell.value))
            .map(i => i.spell.value);
        selectedSpells = allSpells.filter(s => selectedSpells.includes(s.name));
        const spellLevels = [];
        for (let i = 1; i <= maxSpellLevel; i++) {
            const spellLevelSlots = Cleric.#getSlotsForSpellLevel(level, i);
            const levelSpells = selectedSpells.filter(s => s.level == i).map(s => ({ title: s.title, alwaysPrepared: false }));
            spellLevels.push({
                level: i,
                slots: spellLevelSlots,
                spells: levelSpells
            });
        }
        const wisdomModifier = Number(character.getAbilityScoreModifier("wisdom"));
        let numberOfSpellsToPrepare = level + wisdomModifier;
        if (numberOfSpellsToPrepare < 1) {
            numberOfSpellsToPrepare = 1;
        }
        return {
            title: `${Cleric.title} spells`,
            prepareSpells: true,
            spellLevels: spellLevels,
            numberOfSpellsToPrepare: numberOfSpellsToPrepare
        };
    }

    static #getSkillSelectionOptions(character, sources) {
        const clericSkills = ["history", "insight", "medecine", "persuasion", "religion"];
        let skills = [...sources.find(s => s.name == "skills").options];
        skills = skills.filter(s => clericSkills.includes(s.name));
        for (const skill of skills) {
            skill.data = skill.ability;
        }
        const selectedValues = character.selections.find(s => s.name == `${Cleric.name}-skills`)?.values ?? [];
        const selectedElsewhere = character.modifiers
            .filter(m => m.target == "skill-proficiency" && !selectedValues.some(sv => sv.value == m.value))
            .map(m => m.value);
        const options = character.getSelectionOptions(skills, selectedValues, selectedElsewhere, "Skills (choose 2) ...");
        for (const option of options) {
            option.noteText = option.data;
        }
        return options;
    }

    static #getCantripCount(level) {
        switch (level) {
            case 1:
                return 3;
            case 4:
                return 1;
            case 10:
                return 1;
        }
        return 0;
    }

    static #getSpellCount(level) {
        if (level == 1) {
            return 6;
        }
        return 2;
    }

    static #getMaxSpellLevel(level) {
        const slot = Cleric.spellSlots.find(ss => ss.level == level);
        if (slot) {
            return Math.max(...slot.spellLevels.map(sl => Number(sl.spellLevel)));
        }
        return 1;
    }

    static #spellSlots;
    static get spellSlots() {
        if (!Cleric.#spellSlots) {
            const spellSlots = [];
            spellSlots.push(Cleric.#addSpellLevel(1, [2]));
            spellSlots.push(Cleric.#addSpellLevel(2, [3]));
            spellSlots.push(Cleric.#addSpellLevel(3, [4, 2]));
            spellSlots.push(Cleric.#addSpellLevel(4, [4, 3]));
            spellSlots.push(Cleric.#addSpellLevel(5, [4, 3, 2]));
            spellSlots.push(Cleric.#addSpellLevel(6, [4, 3, 3]));
            spellSlots.push(Cleric.#addSpellLevel(7, [4, 3, 3, 1]));
            spellSlots.push(Cleric.#addSpellLevel(8, [4, 3, 3, 2]));
            spellSlots.push(Cleric.#addSpellLevel(9, [4, 3, 3, 3, 1]));
            spellSlots.push(Cleric.#addSpellLevel(10, [4, 3, 3, 3, 2]));
            spellSlots.push(Cleric.#addSpellLevel(11, [4, 3, 3, 3, 2, 1]));
            spellSlots.push(Cleric.#addSpellLevel(12, [4, 3, 3, 3, 2, 1]));
            spellSlots.push(Cleric.#addSpellLevel(13, [4, 3, 3, 3, 2, 1, 1]));
            spellSlots.push(Cleric.#addSpellLevel(14, [4, 3, 3, 3, 2, 1, 1]));
            spellSlots.push(Cleric.#addSpellLevel(15, [4, 3, 3, 3, 2, 1, 1, 1]));
            spellSlots.push(Cleric.#addSpellLevel(16, [4, 3, 3, 3, 2, 1, 1, 1]));
            spellSlots.push(Cleric.#addSpellLevel(17, [4, 3, 3, 3, 2, 1, 1, 1, 1]));
            spellSlots.push(Cleric.#addSpellLevel(18, [4, 3, 3, 3, 3, 1, 1, 1, 1]));
            spellSlots.push(Cleric.#addSpellLevel(19, [4, 3, 3, 3, 3, 2, 1, 1, 1]));
            spellSlots.push(Cleric.#addSpellLevel(20, [4, 3, 3, 3, 3, 2, 2, 1, 1]));
            Cleric.#spellSlots = spellSlots;
        }
        return Cleric.#spellSlots;
    }

    static #addSpellLevel(level, spellLevelsIn) {
        const spellLevels = [];
        for (let i = 0; i < spellLevelsIn.length; i++) {
            spellLevels.push({
                spellLevel: i + 1,
                slots: spellLevelsIn[i]
            })
        }
        return {
            level: level,
            spellLevels: spellLevels
        };
    }

    static #getSlotsForSpellLevel(level, spellLevel) {
        const slot = Cleric.spellSlots.find(ss => ss.level == level);
        if (slot) {
            return slot.spellLevels.find(sl => sl.spellLevel == spellLevel)?.slots ?? 0;
        }
        return 0;
    }

}
