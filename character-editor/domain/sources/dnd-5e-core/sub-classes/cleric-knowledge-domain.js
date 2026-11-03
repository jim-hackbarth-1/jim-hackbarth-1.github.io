
export class ClericKnowledgeDomain {

    static get name() {
        return "cleric-knowledge-domain";
    }

    static get title() {
        return "Knowledge Domain";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/cleric-knowledge-domain.html";
    }

    static get className() {
        return "cleric";
    }

    static getSelections(character, classIndex) {
        const selections = [];
        selections.push(character.getSelection(
            character.selections, `${ClericKnowledgeDomain.name}-languages`, `${ClericKnowledgeDomain.title} - Languages`, 2, [{ name: "languages" }]));
        selections.push(character.getSelection(
            character.selections, `${ClericKnowledgeDomain.name}-skills`, `${ClericKnowledgeDomain.title} - Skills`, 2, [{ name: "skills" }]));
        return selections;
    }

    static getSelectionOptions(character, classIndex, selectionName, sources) {
        let options = [];
        if (selectionName == `${ClericKnowledgeDomain.name}-languages`) {
            const languages = [...sources.find(s => s.name == "languages").options];
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            const selectedElsewhere = character.modifiers
                .filter(m => m.target == "language" && !selectedValues.some(sv => sv.value == m.value?.value))
                .map(m => m.value);
            options = character.getSelectionOptions(
                languages, selectedValues, selectedElsewhere, `${ClericKnowledgeDomain.title} - Languages (choose 2) ...`);
        }
        if (selectionName == `${ClericKnowledgeDomain.name}-skills`) {
            const knowledgeSkills = ["arcana", "history", "nature", "religion"];
            let skills = [...sources.find(s => s.name == "skills").options];
            skills = skills.filter(s => knowledgeSkills.includes(s.name));
            for (const skill of skills) {
                skill.data = skill.ability;
            }
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            const selectedElsewhere = character.modifiers
                .filter(m => m.target == "skill-proficiency" && !selectedValues.some(sv => sv.value == m.value))
                .map(m => m.value);
            options = character
                .getSelectionOptions(skills, selectedValues, selectedElsewhere, `${ClericKnowledgeDomain.title} - Skills (choose 2) ...`);
            for (const option of options) {
                option.noteText = option.data;
            }
        }
        return options;
    }

    static applyModifiers(character, classIndex, targetFilters) {
        const modifiers = [];
        const level = Number(character.classes.find(c => c.value == "cleric").level);

        if (level < 1) {
            character.removeSelection(`${ClericKnowledgeDomain.name}-languages`);
            character.removeSelection(`${ClericKnowledgeDomain.name}-skills`);
        }

        if (level >= 1) {
            const languages = character.selections.find(s => s.name == `${ClericKnowledgeDomain.name}-languages`)?.values ?? [];
            for (const language of languages) {
                if (language.value) {
                    modifiers.push({
                        name: `${ClericKnowledgeDomain.name}-languages-${language.value}`,
                        title: "Language",
                        value: language,
                        target: "language"
                    });
                }
            }
            const proficiencyBonus = Number(character.getProficiencyBonus());
            const skills = character.selections.find(s => s.name == `${ClericKnowledgeDomain.name}-skills`)?.values ?? [];
            for (const skill of skills) {
                if (skill.value) {
                    modifiers.push({
                        name: `${ClericKnowledgeDomain.name}-skill-proficiency-${skill.value}`,
                        title: "Skill proficiency",
                        value: skill.value,
                        target: "skill-proficiency"
                    });
                    modifiers.push({
                        name: `${ClericKnowledgeDomain.name}-skill-bonus-${skill}`,
                        title: "Skill modifier",
                        value: proficiencyBonus,
                        target: "skill:medicine"
                    });
                }
            }
        }
        if (level >= 8) {
            const wisdomModifier = character.getAbilityScoreModifier("wisdom");
            modifiers.push({
                name: `${ClericKnowledgeDomain.name}-potent-spellcasting`,
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
                modifier.sourcePropertyValue = ClericKnowledgeDomain.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, classIndex) {
        const tempFeatures = [];
        const level = Number(character.classes.find(c => c.value == "cleric").level);

        // Channel Divinity: Knowledge of the Ages
        if (level >= 2) {
            const knowledgeOfAgesHtml = `
                <p>You can use your Channel Divinity to tap into a divine well of knowledge. As an action, you choose one skill or tool. For 10 minutes, you have proficiency with the chosen skill or tool.</p>
            `;
            tempFeatures.push(character.getFeatureCard(
                `${ClericKnowledgeDomain.name}-knowledge-of-the-ages`, "Channel Divinity: Knowledge of the Ages", knowledgeOfAgesHtml));
        }

        // Channel Divinity: Read Thoughts
        if (level >= 6) {
            const readThoughtsHtml = `
                <p>
                    At 6th level, you can use your Channel Divinity to read a creature's thoughts. You can then use your access to the creature's mind to command it.
                </p>
                <p>
                    As an action, choose one creature that you can see within 60 feet of you. That creature must make a Wisdom saving throw. If the creature succeeds on the saving throw, you can't use this feature on it again until you finish a long rest.
                </p>
                <p>
                    If the creature fails its save, you can read its surface thoughts (those foremost in its mind, reflecting its current emotions and what it is actively thinking about) when it is within 60 feet of you. This effect lasts for 1 minute.
                </p>
                <p>
                    During that time, you can use your action to end this effect and cast the Suggestion spell on the creature without expending a spell slot. The target automatically fails its saving throw against the spell.
                </p>
            `;
            const attackInfo = character.getAttackInfo({ target: "dc", attackAbility: "wisdom", saveAbility: "wisdom" });
            tempFeatures.push(character.getFeatureCard(
                `${ClericKnowledgeDomain.name}-read-thoughts`,
                "Channel Divinity: Read Thoughts",
                readThoughtsHtml,
                ClericKnowledgeDomain.title,
                attackInfo));
        }

        // Visions of the Past
        if (level >= 17) {
            const visionsOfThePastHtml = `
                <p>
                    You can call up visions of the past that relate to an object you hold or your immediate surroundings. You spend at least 1 minute in meditation and prayer, then receive dreamlike, shadowy glimpses of recent events. You can meditate in this way for a number of minutes equal to your Wisdom score and must maintain concentration during that time, as if you were casting a spell.
                </p>
                <p>
                    Once you use this feature, you can't use it again until you finish a short or long rest.
                </p>
                <p>
                    <b>Object Reading.</b> Holding an object as you meditate, you can see visions of the object's previous owner. After meditating for 1 minute, you learn how the owner acquired and lost the object, as well as the most recent significant event involving the object and that owner. If the object was owned by another creature in the recent past (within a number of days equal to your Wisdom score), you can spend 1 additional minute for each owner to learn the same information about that creature.
                </p>
                <p>
                    <b>Area Reading.</b> As you meditate, you see visions of recent events in your immediate vicinity (a room, street, tunnel, clearing, or the like, up to a 50-foot cube), going back a number of days equal to your Wisdom score. For each minute you meditate, you learn about one significant event, beginning with the most recent. Significant events typically involve powerful emotions, such as battles and betrayals, marriages and murders, births and funerals. However, they might also include more mundane events that are nevertheless important in your current situation.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(
                `${ClericKnowledgeDomain.name}-visions-of-the-past`, "Visions of the Past", visionsOfThePastHtml));
        }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `subClass-${classIndex}`;
            feature.sourcePropertyValue = ClericKnowledgeDomain.name;
            feature.cardSource = ClericKnowledgeDomain.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex) {
        const characterClass = character.classes.find(c => c.value == "cleric");
        const tempSpells = [];
        if (characterClass.level >= 1) {
            tempSpells.push("command");
            tempSpells.push("identify");
        }
        if (characterClass.level >= 3) {
            tempSpells.push("augury");
            tempSpells.push("suggestion");
        }
        if (characterClass.level >= 5) {
            tempSpells.push("nondetection");
            tempSpells.push("speak-with-dead");
        }
        if (characterClass.level >= 7) {
            tempSpells.push("arcane-eye");
            tempSpells.push("confusion");
        }
        if (characterClass.level >= 9) {
            tempSpells.push("legend-lore");
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
            ClericKnowledgeDomain.#addSpell("command", allSpells, classSpellCastingInfo);
            ClericKnowledgeDomain.#addSpell("identify", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 3) {
            ClericKnowledgeDomain.#addSpell("augury", allSpells, classSpellCastingInfo);
            ClericKnowledgeDomain.#addSpell("suggestion", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 5) {
            ClericKnowledgeDomain.#addSpell("nondetection", allSpells, classSpellCastingInfo);
            ClericKnowledgeDomain.#addSpell("speak-with-dead", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 7) {
            ClericKnowledgeDomain.#addSpell("arcane-eye", allSpells, classSpellCastingInfo);
            ClericKnowledgeDomain.#addSpell("confusion", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 9) {
            ClericKnowledgeDomain.#addSpell("legend-lore", allSpells, classSpellCastingInfo);
            ClericKnowledgeDomain.#addSpell("scrying", allSpells, classSpellCastingInfo);
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
