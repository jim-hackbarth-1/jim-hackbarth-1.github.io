
export class Druid {

    static get name() {
        return "druid";
    }

    static get title() {
        return "Druid";
    }

    static get htmlPath() {
        return "dnd-5e-core/classes/druid.html";
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
        return "Druid Circle";
    }

    static get subClassLevel() {
        return 2;
    }

    static getSelections(character, classIndex) {
        let selections = [];
        const level = Number(character.classes.find(c => c.value == Druid.name).level);
        if (level >= 1) {
            selections.push(character.getSelection(
                character.selections, `${Druid.name}-skills`, "Skills", 2, [{ name: "skills" }]));
        }
        for (let i = 1; i <= 20; i++) {
            if (level >= i) {
                const cantripCount = Druid.#getCantripCount(i);
                const spellCount = Druid.#getSpellCount(i);
                selections.push(character.getSpellSelection(
                    i, classIndex, cantripCount, spellCount, false));
            }
        }
        return selections;
    }

    static getSelectionOptions(character, classIndex, selectionName, sources) {
        if (selectionName == `${Druid.name}-skills`) {
            return Druid.#getSkillSelectionOptions(character, sources);
        }
        for (let i = 1; i <= 20; i++) {
            let selectionNames = [
                `${Druid.name}-level-${i}-cantrips`,
                `${Druid.name}-level-${i}-spells`,
                `${Druid.name}-level-${i}-replaced-spell`,
                `${Druid.name}-level-${i}-replacement-spell`
            ]
            if (selectionNames.includes(selectionName)) {
                const cantripCount = Druid.#getCantripCount(i);
                const spellCount = Druid.#getSpellCount(i);
                const maxSpellLevel = Druid.#getMaxSpellLevel(i);
                return character.getSpellSelectionOptions(
                    i, classIndex, selectionName, sources, cantripCount, spellCount, maxSpellLevel);
            }
        }
        return [];
    }

    static applyModifiers(character, classIndex, targetFilters) {

        const modifiers = [];
        const level = Number(character.classes.find(c => c.value == Druid.name).level);
        if (level < 1) {
            character.removeSelection(`${Druid.name}-skills`);
        }
        for (let i = level + 1; i <= 20; i++) {
            character.removeSelection(`${Druid.name}-level-${i}-cantrips`);
            character.removeSelection(`${Druid.name}-level-${i}-spells`);
        }

        if (level >= 1) {
            modifiers.push({
                name: `${Druid.name}-spell-casting-class`,
                title: "Spell casting class",
                value: `${Druid.name}:wisdom`,
                target: "spell-casting-class"
            });
            modifiers.push({
                name: `${Druid.name}-armor-proficiency-light-armor`,
                title: "Armor proficiency",
                value: "light-armor",
                target: "armor-proficiency"
            });
            modifiers.push({
                name: `${Druid.name}-armor-proficiency-medium-armor`,
                title: "Armor proficiency",
                value: "medium-armor",
                target: "armor-proficiency"
            });
            modifiers.push({
                name: `${Druid.name}-armor-proficiency-shield`,
                title: "Armor proficiency",
                value: "shield",
                target: "armor-proficiency"
            });

            if (character.classes[0].value == Druid.name) {
                modifiers.push({
                    name: `${Druid.name}-weapon-proficiency-club`,
                    title: "Weapon proficiency",
                    value: "club",
                    target: "weapon-proficiency"
                });
                modifiers.push({
                    name: `${Druid.name}-weapon-proficiency-dagger`,
                    title: "Weapon proficiency",
                    value: "dagger",
                    target: "weapon-proficiency"
                });
                modifiers.push({
                    name: `${Druid.name}-weapon-proficiency-dart`,
                    title: "Weapon proficiency",
                    value: "dart",
                    target: "weapon-proficiency"
                });
                modifiers.push({
                    name: `${Druid.name}-weapon-proficiency-javelin`,
                    title: "Weapon proficiency",
                    value: "javelin",
                    target: "weapon-proficiency"
                });
                modifiers.push({
                    name: `${Druid.name}-weapon-proficiency-mace`,
                    title: "Weapon proficiency",
                    value: "mace",
                    target: "weapon-proficiency"
                });
                modifiers.push({
                    name: `${Druid.name}-weapon-proficiency-quarterstaff`,
                    title: "Weapon proficiency",
                    value: "quarterstaff",
                    target: "weapon-proficiency"
                });
                modifiers.push({
                    name: `${Druid.name}-weapon-proficiency-scimitar`,
                    title: "Weapon proficiency",
                    value: "scimitar",
                    target: "weapon-proficiency"
                });
                modifiers.push({
                    name: `${Druid.name}-weapon-proficiency-sickle`,
                    title: "Weapon proficiency",
                    value: "sickle",
                    target: "weapon-proficiency"
                });
                modifiers.push({
                    name: `${Druid.name}-weapon-proficiency-sling`,
                    title: "Weapon proficiency",
                    value: "sling",
                    target: "weapon-proficiency"
                });
                modifiers.push({
                    name: `${Druid.name}-weapon-proficiency-spear`,
                    title: "Weapon proficiency",
                    value: "spear",
                    target: "weapon-proficiency"
                });
                modifiers.push({
                    name: `${Druid.name}-tool-proficiency-herbalism-kit`,
                    title: "Tool proficiency",
                    value: "herbalism-kit",
                    target: "tool-proficiency"
                });
                modifiers.push({
                    name: `${Druid.name}-saving-throw-proficiency-wisdom`,
                    title: "Saving throw proficiency: Wisdom",
                    value: "wisdom",
                    target: "saving-throw-proficiency"
                });
                modifiers.push({
                    name: `${Druid.name}-saving-throw-proficiency-intelligence`,
                    title: "Saving throw proficiency: Intelligence",
                    value: "intelligence",
                    target: "saving-throw-proficiency"
                });

                const skillProficiencies = character.selections.find(s => s.name == `${Druid.name}-skills`)?.values ?? [];
                for (const skillProficiency of skillProficiencies) {
                    modifiers.push({
                        name: `${Druid.name}-skill-proficiency-${skillProficiency.value}`,
                        title: "Skill proficiency",
                        value: skillProficiency.value,
                        target: "skill-proficiency"
                    });
                }

                modifiers.push({
                    name: `${Druid.name}-languages-druidic`,
                    title: "Language",
                    value: { value: "druidic", text: "Druidic" },
                    target: "language"
                });
            }
        }

        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `class-${classIndex}`;
                modifier.sourcePropertyValue = Druid.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, classIndex) {
        const tempFeatures = [];
        const level = Number(character.classes.find(c => c.value == Druid.name).level);

        // Wild Shape
        if (level >= 2) {
            let useageNote = "You can use this feature twice between short rests."
            if (level >= 20) {
                useageNote = "";
            }
            let limitationNote = "You may use your action to transform into a beast you have seen before with a challenge rating of 1 or lower.";
            if (level < 8) {
                limitationNote = "You may use your action to transform into a beast you have seen before with a challenge rating of 1/2 or lower and that does not have a flying speed."
            }
            if (level < 3) {
                limitationNote = "You may use your action to transform into a beast you have seen before with a challenge rating of 1/4 or lower and that does not have a flying or swimming speed."
            }
            const hours = Math.floor(level / 2);
            let hoursNote = `${hours} hour`;
            if (hours > 1) {
                hoursNote += "s";
            }
            const wildShapeHtml = `
                <p>
                    ${limitationNote} ${useageNote}
                </p>
                <p>
                    You can stay in a beast shape for ${hoursNote} and can revert to your normal form earlier by using a bonus action. You automatically revert if you fall unconscious or die.
                </p>
                <p>
                    While you are transformed:
                    <ul>
                        <li>Your game statistics are replaced by the statistics of the beast, but you retain your personality, ability scores, and skills. You retain your saving throw proficiencies and gain those of the creature.</li>
                        <li>When you revert to your normal form, you return to the number of hit points you had before you transformed. However, if you revert as a result of dropping to 0 hit points, any excess damage carries over to your normal form.</li>
                        <li>You can’t cast spells, and your ability to speak or take actions is limited to the capabilities of your beast form. Transforming doesn’t break your concentration on a spell, however, or prevent you from taking actions that are part of a spell that you’ve already cast.</li>
                        <li>You retain the benefit of any features from your class, race, or other source and can use them if the new form is physically capable of doing so. However, you can’t use any of your special senses, such as darkvision, unless your new form also has that sense.</li>
                    </ul>
                </p>
            `;
            const wildShape = character.getFeatureCard(`${Druid.name}-wild-shape`, "Wild Shape", wildShapeHtml);
            if (level < 20) {
                wildShape.useInfo = { reset: "short-rest", uses: 2 };
            }
            tempFeatures.push(wildShape);
        }

        if (level >= 18) {

            // Timeless Body
            const timelessBodyHtml = `
                <p>
                    The primal magic that you wield causes you to age more slowly. For every 10 years that pass, your body ages only 1 year.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${Druid.name}-timeless-body`, "Timeless Body", timelessBodyHtml));

            // Beast Spells
            const beastSpellsHtml = `
                <p>
                    You can cast many of your druid spells in any shape you assume using Wild Shape. You can perform the somatic and verbal components of a druid spell while in a beast shape, but you aren’t able to provide material components.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${Druid.name}-beast-spells`, "Beast Spells", beastSpellsHtml));
        }

        // Archdruid
        if (level >= 20) {
            const archDruidHtml = `
                <p>
                    You can use your Wild Shape an unlimited number of times.
                </p>
                <p>
                    Additionally, you can ignore the verbal and somatic components of your druid spells, as well as any material components that lack a cost and aren’t consumed by a spell. You gain this benefit in both your normal shape and your beast shape from Wild Shape.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${Druid.name}-archdruid`, "Archdruid", archDruidHtml));
        }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `class-${classIndex}`;
            feature.sourcePropertyValue = Druid.name;
            feature.cardSource = Druid.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex) {
        const spellSelectionInfo = character.getSpellSelectionInfo(Druid.name);
        const replacedSpells = [];
        const selectedSpells = spellSelectionInfo
            .filter(i => !i.isReplacedSpellSelection && !replacedSpells.includes(i.spell.value))
            .map(i => i.spell.value);
        for (const spell of selectedSpells) {
            spells.push(spell);
        }
    }

    static getSpellCastingInfo(character, allSpells) {
        const level = Number(character.classes.find(c => c.value == Druid.name).level);
        if (!level) {
            return null;
        }
        const maxSpellLevel = Druid.#getMaxSpellLevel(level);
        const spellSelectionInfo = character.getSpellSelectionInfo(Druid.name);
        const replacedSpells = [];
        let selectedSpells = spellSelectionInfo
            .filter(i => !i.isReplacedSpellSelection && !replacedSpells.includes(i.spell.value))
            .map(i => i.spell.value);
        selectedSpells = allSpells.filter(s => selectedSpells.includes(s.name));
        const spellLevels = [];
        for (let i = 1; i <= maxSpellLevel; i++) {
            const spellLevelSlots = Druid.#getSlotsForSpellLevel(level, i);
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
            title: `${Druid.title} spells`,
            prepareSpells: true,
            spellLevels: spellLevels,
            numberOfSpellsToPrepare: numberOfSpellsToPrepare
        };
    }

    static #getSkillSelectionOptions(character, sources) {
        const druidSkills = ["arcana", "animal-handling", "insight", "medicine", "nature", "perception", "religion", "survival"];
        let skills = [...sources.find(s => s.name == "skills").options];
        skills = skills.filter(s => druidSkills.includes(s.name));
        for (const skill of skills) {
            skill.data = skill.ability;
        }
        const selectedValues = character.selections.find(s => s.name == `${Druid.name}-skills`)?.values ?? [];
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
                return 2;
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
        const slot = Druid.spellSlots.find(ss => ss.level == level);
        if (slot) {
            return Math.max(...slot.spellLevels.map(sl => Number(sl.spellLevel)));
        }
        return 1;
    }

    static #spellSlots;
    static get spellSlots() {
        if (!Druid.#spellSlots) {
            const spellSlots = [];
            spellSlots.push(Druid.#addSpellLevel(1, [2]));
            spellSlots.push(Druid.#addSpellLevel(2, [3]));
            spellSlots.push(Druid.#addSpellLevel(3, [4, 2]));
            spellSlots.push(Druid.#addSpellLevel(4, [4, 3]));
            spellSlots.push(Druid.#addSpellLevel(5, [4, 3, 2]));
            spellSlots.push(Druid.#addSpellLevel(6, [4, 3, 3]));
            spellSlots.push(Druid.#addSpellLevel(7, [4, 3, 3, 1]));
            spellSlots.push(Druid.#addSpellLevel(8, [4, 3, 3, 2]));
            spellSlots.push(Druid.#addSpellLevel(9, [4, 3, 3, 3, 1]));
            spellSlots.push(Druid.#addSpellLevel(10, [4, 3, 3, 3, 2]));
            spellSlots.push(Druid.#addSpellLevel(11, [4, 3, 3, 3, 2, 1]));
            spellSlots.push(Druid.#addSpellLevel(12, [4, 3, 3, 3, 2, 1]));
            spellSlots.push(Druid.#addSpellLevel(13, [4, 3, 3, 3, 2, 1, 1]));
            spellSlots.push(Druid.#addSpellLevel(14, [4, 3, 3, 3, 2, 1, 1]));
            spellSlots.push(Druid.#addSpellLevel(15, [4, 3, 3, 3, 2, 1, 1, 1]));
            spellSlots.push(Druid.#addSpellLevel(16, [4, 3, 3, 3, 2, 1, 1, 1]));
            spellSlots.push(Druid.#addSpellLevel(17, [4, 3, 3, 3, 2, 1, 1, 1, 1]));
            spellSlots.push(Druid.#addSpellLevel(18, [4, 3, 3, 3, 3, 1, 1, 1, 1]));
            spellSlots.push(Druid.#addSpellLevel(19, [4, 3, 3, 3, 3, 2, 1, 1, 1]));
            spellSlots.push(Druid.#addSpellLevel(20, [4, 3, 3, 3, 3, 2, 2, 1, 1]));
            Druid.#spellSlots = spellSlots;
        }
        return Druid.#spellSlots;
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
        const slot = Druid.spellSlots.find(ss => ss.level == level);
        if (slot) {
            return slot.spellLevels.find(sl => sl.spellLevel == spellLevel)?.slots ?? 0;
        }
        return 0;
    }

}
