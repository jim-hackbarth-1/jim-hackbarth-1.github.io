
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
        const level = Number(character.classes.find(c => c.value == "bard").level);
        if (level >= 1) {
            let maxSelections = 1;
            let musicalInstrumentTitle = "Musical instrument";
            let skillTitle = "Skill";
            if (character.classes[0].value == "bard") {
                maxSelections = 3;
                musicalInstrumentTitle += "s";
                skillTitle += "s";
            }
            selections.push(character.selectionUtilities.getSelection(
                character.selections, `${Bard.name}-musical-instruments`, musicalInstrumentTitle, maxSelections, [{ name: "tools" }]));
            selections.push(character.selectionUtilities.getSelection(
                character.selections, `${Bard.name}-skills`, skillTitle, maxSelections, [{ name: "skills" }]));
        }
        if (level >= 3) {
            selections.push(Bard.#getExpertSkillSelection(character, 3)); 
        }
        if (level >= 10) {
            selections.push(Bard.#getExpertSkillSelection(character, 10));
        }
        for (let i = 1; i <= 20; i++) {
            if (level >= i) {
                selections.push(Bard.#getSpellSelection(character, i, classIndex));
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

        const level = Number(character.classes.find(c => c.value == "bard").level);
        if (level < 3) {
            character.removeSelection(`${Bard.name}-skill-expertise-level-3`);
        }
        if (level < 10) {
            character.removeSelection(`${Bard.name}-skill-expertise-level-10`);
        }
        for (let i = level + 1; i <= 20; i++) {
            character.removeSelection(`${Bard.name}-level-${i}-cantrips`);
            character.removeSelection(`${Bard.name}-level-${i}-spells`);
            character.removeSelection(`${Bard.name}-level-${i}-replaced-spell`);
            character.removeSelection(`${Bard.name}-level-${i}-replacement-spell`);
        }

        if (level >= 1) {
            modifiers.push({
                name: "bard-armor-proficiency-light-armor",
                title: "Armor proficiency",
                value: "light-armor",
                target: "armor-proficiency"
            });

            const skillProficiencies = character.selections.find(s => s.name == `${Bard.name}-skills`)?.values ?? [];
            for (const skillProficiency of skillProficiencies) {
                modifiers.push({
                    name: `bard-skill-proficiency-${skillProficiency.value}`,
                    title: "Skill proficiency",
                    value: skillProficiency.value,
                    target: "skill-proficiency"
                });
            }

            const musicalInstrumentProficiencies = character.selections.find(s => s.name == `${Bard.name}-musical-instruments`)?.values ?? [];
            for (const musicalInstrumentProficiency of musicalInstrumentProficiencies) {
                modifiers.push({
                    name: `bard-musical-instrument-proficiency-${musicalInstrumentProficiency.value}`,
                    title: "Musical instrument proficiency",
                    value: musicalInstrumentProficiency.value,
                    target: "tool-proficiency"
                });
            }

            if (character.classes[0].value == "bard") {
                modifiers.push({
                    name: "bard-weapon-type-proficiency-simple-melee",
                    title: "Weapon proficiency",
                    value: "simple-melee",
                    target: "weapon-proficiency"
                });
                modifiers.push({
                    name: "bard-weapon-proficiency-crossbow-hand",
                    title: "Weapon proficiency",
                    value: "crossbow-hand",
                    target: "weapon-proficiency"
                });
                modifiers.push({
                    name: "bard-weapon-proficiency-longsword",
                    title: "Weapon proficiency",
                    value: "longsword",
                    target: "weapon-proficiency"
                });
                modifiers.push({
                    name: "bard-weapon-proficiency-rapier",
                    title: "Weapon proficiency",
                    value: "rapier",
                    target: "weapon-proficiency"
                });
                modifiers.push({
                    name: "bard-weapon-proficiency-shortsword",
                    title: "Weapon proficiency",
                    value: "shortsword",
                    target: "weapon-proficiency"
                });
                modifiers.push({
                    name: "bard-saving-throw-proficiency-dexterity",
                    title: "Saving throw proficiency: Dexterity",
                    value: "dexterity",
                    target: "saving-throw-proficiency"
                });
                modifiers.push({
                    name: "bard-saving-throw-proficiency-charisma",
                    title: "Saving throw proficiency: Charisma",
                    value: "charisma",
                    target: "saving-throw-proficiency"
                });
            }
        }

        const proficiencyBonus = character.getProficiencyBonus();
        if (level >= 2) {
            const proficientAbilities = character.modifiers.filter(m => m.target == "saving-throw-proficiency").map(m => m.value);
            const abilities = ["strength", "intelligence", "wisdom", "dexterity", "constitution", "charisma"];
            const jackOfAllTradesBonus = Math.floor(Number(proficiencyBonus) / 2);
            for (const ability of abilities) {
                if (!proficientAbilities.includes(ability)) {
                    modifiers.push({
                        name: `bard-jack-of-all-trades-${ability}`,
                        title: "Jack of all trades",
                        value: jackOfAllTradesBonus,
                        target: `ability-score-modifier:${ability}`
                    });
                }
            }
        }

        const proficientSkills = character.modifiers.filter(m => m.target == "skill-proficiency").map(m => m.value);
        if (level >= 3) {
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
        }

        if (level >= 10) {
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
        const charismaModifier = character.getAbilityScoreModifier("charisma");
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

    static #getExpertSkillSelection(character, level) {
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

    static #getMusicalInstrumentSelectionOptions(character, sources) {
        let instruments = [...sources.find(s => s.name == "tools").options];
        instruments = instruments.filter(i => i.properties && i.properties.some(p => p == "musical-instrument"));
        const selectedValues = character.selections.find(s => s.name == `${Bard.name}-musical-instruments`)?.values ?? [];
        const selectedElsewhere = character.modifiers
            .filter(m => m.target == "tool-proficiency" && !selectedValues.some(sv => sv.value == m.value))
            .map(m => m.value);
        let label = "Musical instrument ...";
        if (character.classes[0].value == "bard") {
            label = "Musical instruments (choose 3) ...";
        }
        return character.selectionUtilities.getSelectionOptions(instruments, selectedValues, selectedElsewhere, label);
    }

    static #getSkillSelectionOptions(character, sources) {
        let skills = [...sources.find(s => s.name == "skills").options];
        for (const skill of skills) {
            skill.source = { title: skill.ability }
        }
        const selectedValues = character.selections.find(s => s.name == `${Bard.name}-skills`)?.values ?? [];
        const selectedElsewhere = character.modifiers
            .filter(m => m.target == "skill-proficiency" && !selectedValues.some(sv => sv.value == m.value))
            .map(m => m.value);
        let label = "Skill ...";
        if (character.classes[0].value == "bard") {
            label = "Skills (choose 3) ...";
        }
        return character.selectionUtilities.getSelectionOptions(skills, selectedValues, selectedElsewhere, label);
    }

    static #getExpertSkillSelectionOptions(character, level, sources) {
        let skills = [...sources.find(s => s.name == "skills").options];
        const proficientSkills = character.modifiers.filter(m => m.target == "skill-proficiency").map(m => m.value);
        skills = skills.filter(o => proficientSkills.includes(o.name));
        for (const skill of skills) {
            skill.source = { title: skill.ability }
        }
        const selectedValues = character.selections.find(s => s.name == `${Bard.name}-skill-expertise-level-${level}`)?.values ?? [];
        let selectedElsewhere = [];
        if (level == 3) {
            selectedElsewhere = character.selections.find(s => s.name == `${Bard.name}-skill-expertise-level-10`)?.values ?? [];
        }
        if (level == 10) {
            selectedElsewhere = character.selections.find(s => s.name == `${Bard.name}-skill-expertise-level-3`)?.values ?? [];
        }
        return character.selectionUtilities.getSelectionOptions(skills, selectedValues, selectedElsewhere, "Expert skills (choose 2) ....");
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
        const slot = Bard.spellSlots.find(ss => ss.level == level);
        if (slot) {
            return slot.spellLevels.find(sl => sl.spellLevel == spellLevel)?.slots ?? 0;
        }
        return 0;
    }

    static #getSpellSelection(character, level, classIndex) {
        const cantripCount = Bard.#getCantripCount(level);
        const spellCount = Bard.#getSpellCount(level);
        const canReplace = (level > 1);
        let selectionName = null;
        let alertMessage = null;       
        const spellSelectionInfo = Bard.#getSpellSelectionInfo(character);

        let cantrips = null;
        if (cantripCount > 0) {
            cantrips = character.selectionUtilities.getSelection(
                character.selections, `${Bard.name}-level-${level}-cantrips`, "Cantrips", cantripCount, [{ name: "spells" }]);
        }
        let spells = null;
        if (spellCount > 0) {
            selectionName = `${Bard.name}-level-${level}-spells`;
            alertMessage = Bard.#getReplacedSpellAlertMessage(character, selectionName, spellSelectionInfo);
            spells = character.selectionUtilities.getSelection(
                character.selections, selectionName, "Spells", spellCount, [{ name: "spells" }], alertMessage ? true : false, alertMessage);
        }
        let replacedSpell = null;
        if (canReplace) {
            selectionName = `${Bard.name}-level-${level}-replaced-spell`;
            alertMessage = Bard.#getReplacedSpellAlertMessage(character, selectionName, spellSelectionInfo);
            replacedSpell = character.selectionUtilities.getSelection(
                character.selections, selectionName, "Replaced spell", 1, [{ name: "spells" }], alertMessage ? true : false, alertMessage, true);
        }
        let replacementSpell = null;
        if (canReplace) {
            let hasReplacedSelection = false;
            let replacedSelections = character.selections.find(s => s.name == `${Bard.name}-level-${level}-replaced-spell`)?.values ?? [];
            if (replacedSelections.length == 1 && replacedSelections[0].value) {
                hasReplacedSelection = true;
            }
            selectionName = `${Bard.name}-level-${level}-replacement-spell`;
            if (hasReplacedSelection) {
                alertMessage = Bard.#getReplacedSpellAlertMessage(character, selectionName, spellSelectionInfo);
            }
            else {
                alertMessage = "Locked: Replaced spell selection required";
            }
            replacementSpell = character.selectionUtilities.getSelection(
                character.selections, selectionName, "Replacement spell", 1, [{ name: "spells" }], alertMessage ? true : false, alertMessage, true);
        }
        return {
            name: `${Bard.name}-level-${level}-spell-selections`,
            title: `Level ${level} spells`,
            spellSelection: true,
            classIndex: classIndex,
            className: Bard.name,
            subClassName: null,
            defaultSummaryDisplay: "Choose spells...",
            cantrips: cantrips,
            spells: spells,
            replacedSpell: replacedSpell,
            replacementSpell: replacementSpell
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
        const spellSelectionInfo = Bard.#getSpellSelectionInfo(character);
        if (selectionSource == "replaced-spell") {
            const spellsSelectedAtLowerLevels = spellSelectionInfo
                .filter(i => i.selectionLevel < level && !i.isCantripSelection && !i.isReplacedSpellSelection)
                .map(i => i.spell);
            spells = spells.filter(s => spellsSelectedAtLowerLevels.some(ssatl => ssatl.value == s.name));
        }
        const currentSelections = spellSelectionInfo.filter(i => i.selectionName == selectionName).map(i => i.spell);
        let options = [];
        for (const spell of spells) {
            const isSelected = currentSelections.some(cs => cs.value == spell.name);
            let disabledReason = null
            const replacementSpell = Bard.#getReplacementSpell(character, spell.name, spellSelectionInfo);
            if (replacementSpell) {
                disabledReason = `Disabled: ${spell.title} has been replaced by ${replacementSpell.text}.`
            }
            if (!disabledReason && selectionSource != "replaced-spell") {
                const isSelectedElsewhere = Bard.#isSpellSelectedElsewhere(character, spell.name, selectionName, spellSelectionInfo);
                if (isSelectedElsewhere) {
                    disabledReason = `Disabled: ${spell.title} selected elsewhere.`
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
                isDisabled: disabledReason ? true : false,
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
            choiceLabel = "Replaced spell (optional, choose 1) ...";
        }
        if (selectionName.endsWith("-replacement-spell")) {
            choiceLabel = "Replacement spell (optional, choose 1) ...";;
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
                selectionList.push({ spell: selection, selectionName: selectionName, selectionLevel: i, isCantripSelection: true });
            }
            selectionName = `${Bard.name}-level-${i}-spells`
            selections = character.selections.find(s => s.name == selectionName)?.values ?? [];
            for (const selection of selections) {
                selectionList.push({ spell: selection, selectionName: selectionName, selectionLevel: i, isSpellSelection: true });
            }
            selectionName = `${Bard.name}-level-${i}-replaced-spell`
            selections = character.selections.find(s => s.name == selectionName)?.values ?? [];
            for (const selection of selections) {
                selectionList.push({ spell: selection, selectionName: selectionName, selectionLevel: i, isReplacedSpellSelection: true });
            }
            selectionName = `${Bard.name}-level-${i}-replacement-spell`
            selections = character.selections.find(s => s.name == selectionName)?.values ?? [];
            for (const selection of selections) {
                selectionList.push({ spell: selection, selectionName: selectionName, selectionLevel: i, isReplacementSpellSelection: true });
            }
        }
        return selectionList;
    }

    static #getReplacementSpell(character, spellName, spellSelectionInfo) {
        const replacedSpell = spellSelectionInfo.find(i => i.isReplacedSpellSelection && i.spell?.value == spellName);
        if (replacedSpell) {
            return spellSelectionInfo
                .find(i => i.isReplacementSpellSelection && i.selectionLevel == replacedSpell.selectionLevel)?.spell;
        }
        return null;
    }

    static #getReplacedSpellAlertMessage(character, selectionName, spellSelectionInfo) {
        let selections = character.selections.find(s => s.name == selectionName)?.values ?? [];
        if (selections.length == 1 && selections[0].value) {
            const spellName = selections[0].value;
            const spellText = selections[0].text;
            const spellReplacement = Bard.#getReplacementSpell(character, spellName, spellSelectionInfo);
            if (spellReplacement?.value) {
                return `Locked: ${spellText} has been replaced by ${spellReplacement.text}.`;
            }
        }
        return null;
    }

    static #isSpellSelectedElsewhere(character, spellName, selectionName, spellSelectionInfo,) {
        return spellSelectionInfo.some(
            i => i.spell?.value == spellName && !i.isReplacedSpellSelection && i.selectionName != selectionName);
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
