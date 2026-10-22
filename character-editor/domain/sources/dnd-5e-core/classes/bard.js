
export class Bard {

    static get name() {
        return "bard";
    }

    static get title() {
        return "Bard";
    }

    static get htmlPath() {
        return "dnd-5e-core/classes/bard.html";
    }

    static get hitDieSize() {
        return 8;
    }

    static get startingEquipment() {
        return `
            <ul>
                <li>(a) a rapier, (b) a longsword, or (c) any simple weapon</li>
                <li>(a) a diplomat’s pack or (b) an entertainer’s pack</li>
                <li>(a) a lute or (b) any other musical instrument</li>
                <li>Leather armor and a dagger</li>
            </ul>
        `;
    }

    static get startingGold() {
        return "5d4 x 10 gp";
    }
    
    static getMulticlassEligibility(character) {
        const charisma = Number(character.getAbilityScore("charisma"));
        if (charisma >= 13) {
            return {
                isEligible: true,
                ineligibilityReason: null
            };
        }
        return {
            isEligible: false,
            ineligibilityReason: "Charisma >= 13 required"
        };
    }

    static get subClassTitle() {
        return "Bard College";
    }

    static get subClassLevel() {
        return 3;
    }

    static getSelections(character, classIndex) {
        let selections = [];
        selections.push(Bard.#getMusicalInstrumentsSelections(character));
        selections.push(Bard.#getSkillSelections(character));
        const level = Number(character.classes.find(c => c.value == "bard").level);
        if (level >= 3) {
            selections.push(Bard.#getExpertSkillSelections(character, 3)); 
        }
        if (level >= 10) {
            selections.push(Bard.#getExpertSkillSelections(character, 10));
        }
        for (let i = 1; i <= 20; i++) {
            if (level >= i) {
                selections.push(Bard.#getSpellSelections(character, i, classIndex));
            }
        }
        return selections;
    }

    static getSelectionOptions(character, classIndex, selectionName, sources) {
        if (selectionName == `${Bard.name}-musical-instruments`) {
            return Bard.#getMusicalInstrumentSelectionOptions(character, sources);
        }
        if (selectionName == `${Bard.name}-skills`) {
            return Bard.#getSkillSelectionOptions(character, sources);
        }
        if (selectionName == `${Bard.name}-skill-expertise-level-3`) {
            return Bard.#getExpertSkillSelectionOptions(character, 3, sources);
        }
        if (selectionName == `${Bard.name}-skill-expertise-level-10`) {
            return Bard.#getExpertSkillSelectionOptions(character, 10, sources);
        }
        for (let i = 1; i <= 20; i++) {
            let selectionNames = [
                `${Bard.name}-level-${i}-cantrips`,
                `${Bard.name}-level-${i}-spells`,
                `${Bard.name}-level-${i}-replaced-spell`,
                `${Bard.name}-level-${i}-replacement-spell`
            ]
            if (selectionNames.includes(selectionName)) {
                return Bard.#getSpellSelectionOptions(character, i, selectionName, sources);
            }
        }
        return [];
    }

    static applyModifiers(character, classIndex, targetFilters) {
        const modifiers = [];
        modifiers.push({
            name: "bard-armor-proficiency-light-armor",
            target: "armor-proficiency",
            value: "light-armor",
            title: Bard.title
        });
        const skillProficiencies = character.selections.find(s => s.name == `${Bard.name}-skills`)?.values ?? [];
        for (const skillProficiency of skillProficiencies) {
            modifiers.push({
                name: `bard-skill-proficiency-${skillProficiency.value}`,
                target: "skill-proficiency",
                value: skillProficiency.value,
                title: Bard.title
            });
        }
        const musicalInstrumentProficiencies = character.selections.find(s => s.name == `${Bard.name}-musical-instruments`)?.values ?? [];
        for (const musicalInstrumentProficiency of musicalInstrumentProficiencies) {
            modifiers.push({
                name: `bard-musical-instrument-proficiency-${musicalInstrumentProficiency.value}`,
                target: "tool-proficiency",
                value: musicalInstrumentProficiency.value,
                title: Bard.title
            });
        }

        if (character.classes[0].value == "bard") {
            modifiers.push({
                name: "bard-weapon-type-proficiency-simple-melee",
                target: "weapon-proficiency",
                value: "simple-melee",
                title: Bard.title
            });
            modifiers.push({
                name: "bard-weapon-proficiency-crossbow-hand",
                target: "weapon-proficiency",
                value: "crossbow-hand",
                title: Bard.title
            });
            modifiers.push({
                name: "bard-weapon-proficiency-longsword",
                target: "weapon-proficiency",
                value: "longsword",
                title: Bard.title
            });
            modifiers.push({
                name: "bard-weapon-proficiency-rapier",
                target: "weapon-proficiency",
                value: "rapier",
                title: Bard.title
            });
            modifiers.push({
                name: "bard-weapon-proficiency-shortsword",
                target: "weapon-proficiency",
                value: "shortsword",
                title: Bard.title
            });
            modifiers.push({
                name: "bard-saving-throw-proficiency-dexterity",
                target: "saving-throw-proficiency",
                value: "dexterity",
                title: Bard.title
            });
            modifiers.push({
                name: "bard-saving-throw-proficiency-charisma",
                target: "saving-throw-proficiency",
                value: "charisma",
                title: Bard.title
            });
        }

        const proficientSkills = character.modifiers.filter(m => m.target == "skill-proficiency").map(m => m.value);
        const proficiencyBonus = character.getProficiencyBonus();
        let expertSkillsLevel3 = character.selections.find(s => s.name == `${Bard.name}-skill-expertise-level-3`)?.values ?? [];
        expertSkillsLevel3 = expertSkillsLevel3.filter(cs => proficientSkills.includes(cs.value));
        for (const expertSkill of expertSkillsLevel3) {
            modifiers.push({
                name: `bard-level-3-expert-skill-${expertSkill.value}`,
                target: `skill:${expertSkill.value}`,
                value: proficiencyBonus,
                title: Bard.title
            });
        }
        let expertSkillsLevel10 = character.selections.find(s => s.name == `${Bard.name}-skill-expertise-level-10`)?.values ?? [];
        expertSkillsLevel10 = expertSkillsLevel10.filter(cs => proficientSkills.includes(cs.value));
        for (const expertSkill of expertSkillsLevel10) {
            modifiers.push({
                name: `bard-level-10-expert-skill-${expertSkill.value}`,
                target: `skill:${expertSkill.value}`,
                value: proficiencyBonus,
                title: Bard.title
            });
        }

        const level = Number(character.classes.find(c => c.value == "bard").level);
        if (level >= 2) {
            const proficientAbilities = character.modifiers.filter(m => m.target == "saving-throw-proficiency").map(m => m.value);
            const abilities = ["strength", "intelligence", "wisdom", "dexterity", "constitution", "charisma"];
            const jackOfAllTradesBonus = Math.floor(Number(proficiencyBonus) / 2);
            for (const ability of abilities) {
                if (!proficientAbilities.includes(ability)) {
                    modifiers.push({
                        name: `bard-jack-of-all-trades-${ability}`,
                        target: `ability-score-modifier:${ability}`,
                        value: jackOfAllTradesBonus,
                        title: Bard.title
                    });
                }
            }
        }

        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `class-${classIndex}`;
                modifier.sourcePropertyValue = Bard.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, classIndex) {
        const tempFeatures = [];

        const level = Number(character.classes.find(c => c.value == "bard").level);
        const charismaModifier = character.getAbilityScoreModifier("charisma");

        // bardic inspiration
        let bardicInspirationDieSize = 6;
        if (level >= 5) {
            bardicInspirationDieSize = 8;
        }
        if (level >= 10) {
            bardicInspirationDieSize = 10;
        }
        if (level >= 15) {
            bardicInspirationDieSize = 12;
        }
        let bardicInspirationUses = charismaModifier;
        if (bardicInspirationUses < 1) {
            bardicInspirationUses = 1;
        }
        let bardicInspirationUseLabel = (bardicInspirationUses > 1) ? `${bardicInspirationUses} times` : `${bardicInspirationUses} time`;
        let bardicInspirationReset = "long-rest";
        if (level >= 5) {
            bardicInspirationReset = "short-rest";
        }
        tempFeatures.push({
            name: "bard-bardic-inspiration",
            title: "Bardic Inspiration",
            html: `
                <p>You can inspire others through stirring words or music. To do so, you use a bonus action on your turn to choose one creature other than yourself within 60 feet of you who can hear you. That creature gains one Bardic Inspiration die, a d${bardicInspirationDieSize}.</p>
                <p>Once within the next 10 minutes, the creature can roll the die and add the number rolled to one ability check, attack roll, or saving throw it makes. The creature can wait until after it rolls the d20 before deciding to use the Bardic Inspiration die, but must decide before the DM says whether the roll succeeds or fails. Once the Bardic Inspiration die is rolled, it is lost. A creature can have only one Bardic Inspiration die at a time.</p>
                <p>You can use this feature ${bardicInspirationUseLabel} per ${bardicInspirationReset}.</p>
            `,
            useInfo: {
                reset: bardicInspirationReset,
                uses: bardicInspirationUses
            },
            source: {
                name: "class",
                title: Bard.title
            },
            displayType: "feature-card"
        });

        // Song of Rest
        if (level >= 2) {
            let songOfRestDieSize = 6;
            if (level >= 9) {
                songOfRestDieSize = 8;
            }
            if (level >= 13) {
                songOfRestDieSize = 10;
            }
            if (level >= 17) {
                songOfRestDieSize = 12;
            }
            tempFeatures.push({
                name: "bard-song-of-rest",
                title: "Song of Rest",
                html: `
                <p>You can use soothing music or oration to help revitalize your wounded allies during a short rest. If you or any friendly creatures who can hear your performance regain hit points at the end of the short rest by spending one or more Hit Dice, each of those creatures regains an extra 1d${songOfRestDieSize} hit points.</p>
            `,
                source: {
                    name: "class",
                    title: Bard.title
                },
                displayType: "feature-card"
            });
        }

        // Countercharm
        if (level >= 6) {
            tempFeatures.push({
                name: "bard-countercharm",
                title: "Countercharm",
                html: `
                    <p>You gain the ability to use musical notes or words of power to disrupt mind-influencing effects. As an action, you can start a performance that lasts until the end of your next turn. During that time, you and any friendly creatures within 30 feet of you have advantage on saving throws against being frightened or charmed. A creature must be able to hear you to gain this benefit. The performance ends early if you are incapacitated or silenced or if you voluntarily end it (no action required).</p>
                `,
                source: {
                    name: "class",
                    title: Bard.title
                },
                displayType: "feature-card"
            });
        }

        // Superior Inspiration
        if (level == 20) {
            tempFeatures.push({
                name: "bard-superior-inspiration",
                title: "Superior Inspiration",
                html: `
                    <p>When you roll initiative and have no uses of Bardic Inspiration left, you regain one use.</p>
                `,
                source: {
                    name: "class",
                    title: Bard.title
                },
                displayType: "feature-card"
            });
        }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `class-${classIndex}`;
            feature.sourcePropertyValue = Bard.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex) {
        const spellSelectionInfo = Bard.#getSpellSelectionInfo(character);
        const replacedSpells = spellSelectionInfo.filter(i => i.isReplacedSpellSelection).map(i => i.spell.value);
        const selectedSpells = spellSelectionInfo
            .filter(i => !i.isReplacedSpellSelection && !replacedSpells.includes(i.spell.value))
            .map(i => i.spell.value);
        for (const spell of selectedSpells) {
            spells.push(spell);
        }
    }

    static getSpellCastingInfo(character, allSpells) {
        const level = Number(character.classes.find(c => c.value == "bard").level);
        if (!level) {
            return null;
        }
        const maxSpellLevel = Bard.#getMaxSpellLevel(level);
        const spellSelectionInfo = Bard.#getSpellSelectionInfo(character);
        const replacedSpells = spellSelectionInfo.filter(i => i.isReplacedSpellSelection).map(i => i.spell.value);
        let selectedSpells = spellSelectionInfo
            .filter(i => !i.isReplacedSpellSelection && !replacedSpells.includes(i.spell.value))
            .map(i => i.spell.value);
        selectedSpells = allSpells.filter(s => selectedSpells.includes(s.name));
        const spellLevels = [];
        for (let i = 1; i <= maxSpellLevel; i++) {
            const spellLevelSlots = Bard.#getSlotsForSpellLevel(level, i);
            const levelSpells = selectedSpells.filter(s => s.level == i).map(s => ({ title: s.title, alwaysPrepared: true}));
            spellLevels.push({
                level: i,
                slots: spellLevelSlots,
                spells: levelSpells
            });
        }
        return {
            title: `${Bard.title} spells`,
            prepareSpells: false,
            spellLevels: spellLevels
        };
    }

    static #getMusicalInstrumentsSelections(character) {
        let count = 1;
        if (character.classes[0].value == "bard") {
            count = 3;
        }
        const selectionName = `${Bard.name}-musical-instruments`;
        const currentSelections = character.selections.find(s => s.name == selectionName)?.values ?? [];
        if (currentSelections.length == 0) {
            currentSelections.push({
                value: null,
                text: (count == 3) ? "Musical instruments (choose 3) ..." : "Musical instrument ..."
            });
        }
        return {
            name: selectionName,
            title: (count == 3) ? "Musical instruments" : "Musical instrument",
            maxSelections: count,
            sources: [{ name: "tools" }],
            currentSelections: currentSelections
        };
    }

    static #getMusicalInstrumentSelectionOptions(character, sources) {
        let options = [];
        let instruments = [...sources.find(s => s.name == "tools").options];
        instruments = instruments.filter(i => i.properties && i.properties.some(p => p == "musical-instrument"));
        const selectedValues = character.selections.find(s => s.name == `${Bard.name}-musical-instruments`)?.values ?? [];
        const disabledOptions = character.modifiers
            .filter(m => m.target == "tool-proficiency" && !selectedValues.some(sv => sv.value == m.value))
            .map(m => m.value);
        for (const instrument of instruments) {
            const isSelected = (selectedValues.some(sv => sv.value == instrument.name));
            const isDisabled = disabledOptions.includes(instrument.value);
            const disabledReason = isDisabled ? "Disabled: Proficiency granted by other feature" : "";
            options.push({
                value: instrument.name,
                text: instrument.title,
                noteText: instrument.source.title,
                hasDetail: false,
                isSelected: isSelected,
                isDisabled: isDisabled,
                disabledReason: disabledReason
            })
        }
        options = Bard.#sortOptions(options, "text");
        let label = "Musical instrument ...";
        if (character.classes[0].value == "bard") {
            label = "Musical instruments (choose 3) ...";
        }
        options.unshift({ value: null, text: label, hideCheckbox: true });
        return options;
    }

    static #getSkillSelections(character) {
        let count = 1;
        if (character.classes[0].value == "bard") {
            count = 3;
        }
        const selectionName = `${Bard.name}-skills`;
        const currentSelections = character.selections.find(s => s.name == selectionName)?.values ?? [];
        if (currentSelections.length == 0) {
            currentSelections.push({
                value: null,
                text: (count == 3) ? "Skills (choose 3) ..." : "Skill ..."
            });
        }
        return {
            name: selectionName,
            title: (count == 3) ? "Skills" : "Skill",
            maxSelections: count,
            sources: [{ name: "skills" }],
            currentSelections: currentSelections
        };
    }

    static #getSkillSelectionOptions(character, sources) {
        let options = [];
        let skills = [...sources.find(s => s.name == "skills").options];
        const selectedValues = character.selections.find(s => s.name == `${Bard.name}-skills`)?.values ?? [];
        const disabledOptions = character.modifiers
            .filter(m => m.target == "skill-proficiency" && !selectedValues.some(sv => sv.value == m.value))
            .map(m => m.value);
        for (const skill of skills) {
            const isSelected = (selectedValues.some(sv => sv.value == skill.name));
            const isDisabled = disabledOptions.includes(skill.name);
            const disabledReason = isDisabled ? "Disabled: Skill proficiency granted by other feature" : "";
            options.push({
                value: skill.name,
                text: skill.title,
                noteText: `(${skill.ability})`,
                hasDetail: false,
                isSelected: isSelected,
                isDisabled: isDisabled,
                disabledReason: disabledReason
            })
        }
        options = Bard.#sortOptions(options, "text");
        let label = "Skill ...";
        if (character.classes[0].value == "bard") {
            label = "Skills (choose 3)...";
        }
        options.unshift({ value: null, text: label, hideCheckbox: true });
        return options;
    }

    static #getExpertSkillSelections(character, level) {
        const selectionName = `${Bard.name}-skill-expertise-level-${level}`;
        let currentSelections = character.selections.find(s => s.name == selectionName)?.values ?? [];
        if (currentSelections.length == 0) {
            currentSelections.push({
                value: null,
                text: "Expert skills (choose 2) ..."
            });
        }
        else {
            const proficientSkills = character.modifiers.filter(m => m.target == "skill-proficiency").map(m => m.value);
            currentSelections = currentSelections.filter(cs => proficientSkills.includes(cs.value));
        }
        return {
            name: selectionName,
            title: `Level ${level} expert skills`,
            maxSelections: 2,
            sources: [{ name: "skills" }],
            currentSelections: currentSelections
        };
    }

    static #getExpertSkillSelectionOptions(character, level, sources) {
        let options = [];
        let skills = [...sources.find(s => s.name == "skills").options];
        const proficientSkills = character.modifiers.filter(m => m.target == "skill-proficiency").map(m => m.value);
        skills = skills.filter(o => proficientSkills.includes(o.name));
        const selectedValues = character.selections.find(s => s.name == `${Bard.name}-skill-expertise-level-${level}`)?.values ?? [];
        let disabledOptions = [];
        if (level == 10) {
            disabledOptions = character.selections.find(s => s.name == `${Bard.name}-skill-expertise-level-3`)?.values ?? [];
        }
        for (const skill of skills) {
            const isSelected = selectedValues.some(sv => sv.value == skill.name);
            const isDisabled = disabledOptions.some(sv => sv.value == skill.name);
            const disabledReason = isDisabled ? "Disabled: Expertise granted by other feature" : "";
            options.push({
                value: skill.name,
                text: skill.title,
                noteText: `(${skill.ability})`,
                hasDetail: false,
                isSelected: isSelected,
                isDisabled: isDisabled,
                disabledReason: disabledReason
            });
        }
        options = Bard.#sortOptions(options, "text");
        options.unshift({ value: null, text: "Expert skills (choose 2) ....", hideCheckbox: true });
        return options;
    }

    static #getSpellSelections(character, level, classIndex) {
        const cantripCount = Bard.#getCantripCount(level);
        const spellCount = Bard.#getSpellCount(level);
        const canReplace = (level > 1);
        const spellSelectionInfo = Bard.#getSpellSelectionInfo(character);

        let cantripsSelection = null;
        if (cantripCount > 0) {
            let cantripSelections = character.selections.find(s => s.name == `${Bard.name}-level-${level}-cantrips`)?.values ?? [];
            if (cantripSelections.length == 0) {
                cantripSelections = [{ value: null, text: `Cantrips (choose ${cantripCount}) ...` }];
            }
            cantripsSelection = {
                name: `${Bard.name}-level-${level}-cantrips`,
                title: "Cantrips",
                maxSelections: cantripCount,
                currentSelections: cantripSelections,
                sources: [{ name: "spells" }]
            };
        }

        let spellsSelection = null;
        if (spellCount > 0) {
            let isReplaced = false;
            let spellAlertMessage = null;
            let spellSelections = character.selections.find(s => s.name == `${Bard.name}-level-${level}-spells`)?.values ?? [];
            if (spellSelections.length == 0) {
                spellSelections = [{ value: null, text: `Spells (choose ${spellCount}) ...` }];
            }
            else {
                if (spellSelections.length == 1 && spellCount == 1) {
                    const selectedValue = spellSelections[0].value;
                    if (selectedValue) {
                        const replacedSpell = spellSelectionInfo.find(i => i.isReplacedSpellSelection && i.spell?.value == selectedValue);
                        if (replacedSpell) {
                            isReplaced = true;
                            spellAlertMessage = `Locked: ${spellSelections[0].text} has been replaced`;
                            const replacementSpell = spellSelectionInfo
                                .find(i => i.isReplacementSpellSelection && i.selectionLevel == replacedSpell.selectionLevel);
                            if (replacementSpell?.spell?.value) {
                                spellAlertMessage += ` by ${replacementSpell?.spell?.text ?? "another spell"}.`;
                            }
                            else {
                                spellAlertMessage += ".";
                            }
                        }
                    }
                }
            }
            spellsSelection = {
                name: `${Bard.name}-level-${level}-spells`,
                title: "Spells",
                maxSelections: spellCount,
                locked: isReplaced,
                alertMessage: spellAlertMessage,
                currentSelections: spellSelections,
                sources: [{ name: "spells" }]
            };
        }

        let replacedSpellSelection = null;
        if (canReplace) {
            let replacedSpell = null;
            let replacedSpellSelections = character.selections.find(s => s.name == `${Bard.name}-level-${level}-replaced-spell`)?.values ?? [];
            if (replacedSpellSelections.length > 0) {
                replacedSpell = replacedSpellSelections[0];
            }
            if (!replacedSpell) {
                replacedSpellSelections = [{ value: null, text: "Choose a spell to replace (optional) ..." }];
            }
            const replacementSpell = spellSelectionInfo
                .find(i => i.selectionName == `${Bard.name}-level-${level}-replacement-spell`)?.spell;
            let replacedIsLocked = false;
            let replacedAlertMessage = null;
            if (replacementSpell?.value) {
                replacedIsLocked = true;
                replacedAlertMessage = `Locked: Replacement spell ${replacementSpell.text} selected`;
            }
            replacedSpellSelection = {
                name: `${Bard.name}-level-${level}-replaced-spell`,
                title: "Replaced spell",
                maxSelections: 1,
                locked: replacedIsLocked,
                alertMessage: replacedAlertMessage,
                currentSelections: replacedSpellSelections,
                sources: [{ name: "spells" }]
            };
        }

        let replacementSpellSelection = null;
        if (canReplace) {
            let isReplacementReplaced = false;
            let replacementAlertMessage = null;
            let replacementSpell = null;
            let replacementSpellSelections = character.selections.find(s => s.name == `${Bard.name}-level-${level}-replacement-spell`)?.values ?? [];
            if (replacementSpellSelections.length > 0) {
                replacementSpell = replacementSpellSelections[0];
            }
            if (!replacementSpell) {
                replacementSpellSelections = [{ value: null, text: "Choose a replacement spell (optional) ..." }];
            }
            else {
                if (replacementSpellSelections.length == 1) {
                    const selectedReplacementValue = replacementSpellSelections[0].value;
                    if (selectedReplacementValue) {
                        const replacedSpell2 = spellSelectionInfo
                            .find(i => i.isReplacedSpellSelection && i.spell?.value == selectedReplacementValue);
                        if (replacedSpell2) {
                            isReplacementReplaced = true;
                            replacementAlertMessage = `Locked: ${replacementSpellSelections[0].text} has been replaced`;
                            const replacementSpell2 = spellSelectionInfo
                                .find(i => i.isReplacementSpellSelection && i.selectionLevel == replacedSpell2.selectionLevel);
                            if (replacementSpell2?.spell?.value) {
                                replacementAlertMessage += ` by ${replacementSpell2?.spell?.text ?? "another spell"}.`;
                            }
                            else {
                                replacementAlertMessage += ".";
                            }
                        }
                    }
                }
            }
            replacementSpellSelection = {
                name: `${Bard.name}-level-${level}-replacement-spell`,
                title: "Replacement spell",
                maxSelections: 1,
                locked: isReplacementReplaced,
                alertMessage: replacementAlertMessage,
                currentSelections: replacementSpellSelections,
                sources: [{ name: "spells" }]
            };
        }

        return {
            name: `${Bard.name}-level-${level}-spell-selections`,
            title: `Level ${level} spells`,
            spellSelection: true,
            classIndex: classIndex,
            className: Bard.name,
            subClassName: null,
            defaultSummaryDisplay: "Choose spells...",
            cantrips: cantripsSelection,
            spells: spellsSelection,
            replacedSpell: replacedSpellSelection,
            replacementSpell: replacementSpellSelection
        };
    }

    static #getSpellSelectionOptions(character, level, selectionName, sources) {
        let spells = [...sources.find(s => s.name == "spells").options];
        spells = spells.filter(s => s.classes.includes("bard"));
        const selectionSource = selectionName.replace(`${Bard.name}-level-${level}-`, "");
        if (selectionSource == "cantrips") {
            spells = spells.filter(s => Number(s.level) == 0);
        }
        else {
            spells = spells.filter(s => Number(s.level) >= 1 && Number(s.level) <= level);
        }
        const spellSelectionInfoList = Bard.#getSpellSelectionInfo(character);
        const spellsSelectedElsewhere = spellSelectionInfoList
            .filter(i => i.selectionName != selectionName && !i.isReplacedSpellSelection)
            .map(i => i.spell);
        const spellsReplacedElsewhere = spellSelectionInfoList
            .filter(i => i.isReplacedSpellSelection && i.selectionName != selectionName)
            .map(i => i.spell);
        
        if (selectionSource == "replaced-spell") {
            const spellsSelectedAtLowerLevels = spellSelectionInfoList
                .filter(i => i.selectionLevel < level && !i.isCantripSelection && !i.isReplacedSpellSelection)
                .map(i => i.spell);
            spells = spells.filter(s => spellsSelectedAtLowerLevels.some(ssatl => ssatl.value == s.name));
            spells = spells.filter(s => !spellsReplacedElsewhere.some(sre => sre.value == s.name));
        }
        const hasReplacement = spellSelectionInfoList
            .some(i => i.selectionName == `${Bard.name}-level-${level}-replacement-spell` && i.spell.value);
        const currentSelections = spellSelectionInfoList.filter(i => i.selectionName == selectionName).map(i => i.spell);
        let options = [];
        for (const spell of spells) {
            const isSelected = currentSelections.some(cs => cs.value == spell.name);
            let isDisabled = false;
            let disabledReason = null;
            if (selectionSource == "replaced-spell") {
                if (hasReplacement) {
                    isDisabled = true;
                    disabledReason = "Disabled: Has replacement selected";
                }
            }
            else {
                const isReplaced = spellsReplacedElsewhere.some(sre => sre.value == spell.name);
                if (isReplaced) {
                    isDisabled = true;
                    disabledReason = "Disabled: Has been replaced";
                }
                if (!isDisabled) {
                    const isSelectedElsewhere = spellsSelectedElsewhere.some(sse => sse.value == spell.name);
                    if (isSelectedElsewhere) {
                        isDisabled = true;
                        disabledReason = "Disabled: Selected at other level or as replacement";
                    }
                }
            }
            let spellLevelLabel = `Level ${spell.level}`;
            if (spell.level == 0) {
                spellLevelLabel = "Cantrip";
            }
            options.push({
                value: spell.name,
                text: spell.title,
                noteText: `${spellLevelLabel} (${spell.source.title})`,
                sortField: `level-${spell.level}-${spell.title}`,
                hasDetail: true,
                isSelected: isSelected,
                isDisabled: isDisabled,
                disabledReason: disabledReason
            });
        }
        options = Bard.#sortOptions(options, "sortField");
        let choiceLabel = "Spells ...";
        if (selectionName.endsWith("-cantrips")) {
            choiceLabel = "Cantrips ...";
            const cantripCount = Number(Bard.#getCantripCount(level));
            choiceLabel = `Cantrips (choose ${cantripCount}) ...`;
        }
        if (selectionName.endsWith("-spells")) {
            choiceLabel = "Spells ...";
            const spellCount = Number(Bard.#getSpellCount(level));
            choiceLabel = `Spells (choose ${spellCount}) ...`;
        }
        if (selectionName.endsWith("-replaced-spell")) {
            choiceLabel = "Choose a spell to replace (optional) ...";
        }
        if (selectionName.endsWith("-replacement-spell")) {
            choiceLabel = "Choose a replacement spell (optional) ...";;
        }
        options.unshift({ value: null, text: choiceLabel, hideCheckbox: true });
        return options;
    }

    static #getSpellSelectionInfo(character) {
        const selectionList = []
        for (let i = 1; i <= 20; i++) {
            let selectionName = `${Bard.name}-level-${i}-cantrips`
            let selections = character.selections.find(s => s.name == selectionName)?.values ?? [];
            for (const selection of selections) {
                selectionList.push({
                    spell: selection,
                    selectionName: selectionName,
                    selectionLevel: i,
                    isCantripSelection: true
                });
            }
            selectionName = `${Bard.name}-level-${i}-spells`
            selections = character.selections.find(s => s.name == selectionName)?.values ?? [];
            for (const selection of selections) {
                selectionList.push({
                    spell: selection,
                    selectionName: selectionName,
                    selectionLevel: i,
                    isSpellSelection: true
                });
            }
            selectionName = `${Bard.name}-level-${i}-replaced-spell`
            selections = character.selections.find(s => s.name == selectionName)?.values ?? [];
            for (const selection of selections) {
                selectionList.push({
                    spell: selection,
                    selectionName: selectionName,
                    selectionLevel: i,
                    isReplacedSpellSelection: true
                });
            }
            selectionName = `${Bard.name}-level-${i}-replacement-spell`
            selections = character.selections.find(s => s.name == selectionName)?.values ?? [];
            for (const selection of selections) {
                selectionList.push({
                    spell: selection,
                    selectionName: selectionName,
                    selectionLevel: i,
                    isReplacementSpellSelection: true
                });
            }
        }
        return selectionList;
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
        switch (level) {
            case 1:
                return 4;
            case 10:
                return 2;
            case 12:
                return 0;
            case 14:
                return 2;
            case 16:
                return 0;
            case 18:
                return 2;
            case 19:
                return 0;
            case 20:
                return 0;
        }
        return 1;
    }

    static #getMaxSpellLevel(level) {
        const slot = Bard.spellSlots.find(ss => ss.level == level);
        if (slot) {
            return Math.max(...slot.spellLevels.map(sl => Number(sl.spellLevel)));
        }
        return 1;
    }

    static #spellSlots;
    static get spellSlots() {
        if (!Bard.#spellSlots) {
            const spellSlots = [];
            spellSlots.push(Bard.#addSpellLevel(1, [2]));
            spellSlots.push(Bard.#addSpellLevel(2, [3]));
            spellSlots.push(Bard.#addSpellLevel(3, [4, 2]));
            spellSlots.push(Bard.#addSpellLevel(4, [4, 3]));
            spellSlots.push(Bard.#addSpellLevel(5, [4, 3, 2]));
            spellSlots.push(Bard.#addSpellLevel(6, [4, 3, 3]));
            spellSlots.push(Bard.#addSpellLevel(7, [4, 3, 3, 1]));
            spellSlots.push(Bard.#addSpellLevel(8, [4, 3, 3, 2]));
            spellSlots.push(Bard.#addSpellLevel(9, [4, 3, 3, 3, 1]));
            spellSlots.push(Bard.#addSpellLevel(10, [4, 3, 3, 3, 2]));
            spellSlots.push(Bard.#addSpellLevel(11, [4, 3, 3, 3, 2]));
            spellSlots.push(Bard.#addSpellLevel(12, [4, 3, 3, 3, 2, 1]));
            spellSlots.push(Bard.#addSpellLevel(13, [4, 3, 3, 3, 2, 1, 1]));
            spellSlots.push(Bard.#addSpellLevel(14, [4, 3, 3, 3, 2, 1, 1]));
            spellSlots.push(Bard.#addSpellLevel(15, [4, 3, 3, 3, 2, 1, 1, 1]));
            spellSlots.push(Bard.#addSpellLevel(16, [4, 3, 3, 3, 2, 1, 1, 1]));
            spellSlots.push(Bard.#addSpellLevel(17, [4, 3, 3, 3, 2, 1, 1, 1, 1]));
            spellSlots.push(Bard.#addSpellLevel(18, [4, 3, 3, 3, 3, 1, 1, 1, 1]));
            spellSlots.push(Bard.#addSpellLevel(19, [4, 3, 3, 3, 3, 2, 1, 1, 1]));
            spellSlots.push(Bard.#addSpellLevel(20, [4, 3, 3, 3, 3, 2, 2, 1, 1]));
            Bard.#spellSlots = spellSlots;
        }
        return Bard.#spellSlots;
    }

    static #getSlotsForSpellLevel(level, spellLevel) {
        const slot = Bard.spellSlots.find(ss => ss.level == level);
        if (slot) {
            return slot.spellLevels.find(sl => sl.spellLevel == spellLevel)?.slots ?? 0;
        }
        return 0;
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

    static #sortOptions(array, sortField) {
        function sortByProperty(item1, item2) {
            if (item1[sortField] < item2[sortField]) {
                return -1;
            }
            if (item1[sortField] > item2[sortField]) {
                return 1;
            }
            return 0;
        }
        array.sort(sortByProperty);
        return array;
    }

}
