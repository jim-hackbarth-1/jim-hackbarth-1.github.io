
export class BardCollegeOfLore {

    static get name() {
        return "bard-college-of-lore";
    }

    static get title() {
        return "College of Lore";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/bard-college-of-lore.html";
    }

    static get className() {
        return "bard";
    }

    static getSelections(character, classIndex) {
        const selections = [];
        const level = Number(character.classes.find(c => c.value == "bard").level);
        if (level >= 3) {
            const selectionName = `${BardCollegeOfLore.name}-skill-proficiencies`;
            let currentSelections = character.selections.find(s => s.name == selectionName)?.values ?? [];
            if (currentSelections.length == 0) {
                currentSelections = [{ value: null, text: "Skill proficiencies (choose 3)..." }];
            }
            selections.push({
                name: selectionName,
                title: `${BardCollegeOfLore.title} - Skill proficiencies`,
                maxSelections: 3,
                sources: [{ name: "skills" }],
                currentSelections: currentSelections
            });
        }
        if (level >= 6) {
            let spellSelections = character.selections
                .find(s => s.name == `${BardCollegeOfLore.name}-additional-magical-secrets-spells`)?.values ?? [];
            if (spellSelections.length == 0) {
                spellSelections = [{ value: null, text: "Spells (choose two) ..." }];
            }
            selections.push({
                name: `${BardCollegeOfLore.name}-additional-magical-secrets`,
                title: `${BardCollegeOfLore.title} - Additional magical secrets`,
                spellSelection: true,
                classIndex: classIndex,
                className: "bard",
                subClassName: BardCollegeOfLore.name,
                defaultSummaryDisplay: "Choose spells...",
                cantrips: null,
                spells: {
                    name: `${BardCollegeOfLore.name}-additional-magical-secrets-spells`,
                    title: "Spells",
                    maxSelections: 2,
                    currentSelections: spellSelections,
                    sources: [{ name: "spells" }]
                },
                replacedSpell: null,
                replacementSpell: null
            });
        }
        return selections;
    }

    static getSelectionOptions(character, classIndex, selectionName, sources) {
        let options = [];
        if (selectionName == `${BardCollegeOfLore.name}-skill-proficiencies`) {
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            const disabledOptions = character.modifiers
                .filter(m => m.target == "skill-proficiency" && !selectedValues.some(sv => sv.value == m.value))
                .map(m => m.value);
            options = [...sources.find(s => s.name == "skills").options];
            options = options.map(o =>
            ({
                value: o.name,
                text: o.title,
                noteText: `(${o.ability})`,
                hasDetail: false,
                isSelected: selectedValues.some(sv => sv.value == o.name),
                isDisabled: disabledOptions.includes(o.name),
                disabledReason: disabledOptions.includes(o.name) ? "Proficiency granted by other feature" : ""
            }));
            options.unshift(
                {
                    value: null,
                    text: "Skill proficiencies (choose 3)...",
                    hideCheckbox: true
                });
            let currentSelections = character.selections.find(s => s.name == selectionName)?.values ?? [];
            currentSelections = currentSelections.map(cs => cs.value);
            for (const option of options) {
                option.isSelected = currentSelections.includes(option.value);
            }
        }
        if (selectionName == `${BardCollegeOfLore.name}-additional-magical-secrets-spells`) {
            
            let spells = [...sources.find(s => s.name == "spells").options];
            const level = Number(character.classes.find(c => c.value == "bard").level);
            const maxSpellLevel = Number(BardCollegeOfLore.#getMaxSpellLevel(level));
            spells = spells.filter(s => Number(s.level) <= maxSpellLevel);

            let currentSelections = character.selections.find(s => s.name == selectionName)?.values ?? [];
            for (const spell of spells) {
                const isSelected = currentSelections.some(cs => cs.value == spell.name);
                let isDisabled = false;
                let disabledReason = null;
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
            options = BardCollegeOfLore.#sortOptions(options, "sortField");
            options.unshift({ value: null, text: "Spells (choose two) ...", hideCheckbox: true });
        }      
        return options;
    }

    static applyModifiers(character, classIndex, targetFilters) {
        const modifiers = [];
        const level = Number(character.classes.find(c => c.value == "bard").level);
        const skillProficiencies = character.selections.find(s => s.name == `${BardCollegeOfLore.name}-skill-proficiencies`)?.values ?? [];
        for (const skillProficiency of skillProficiencies) {
            modifiers.push({
                name: `${BardCollegeOfLore.name}-skill-proficiency-${skillProficiency.value}`,
                target: "skill-proficiency",
                value: skillProficiency.value,
                title: BardCollegeOfLore.title
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `subClass-${classIndex}`;
                modifier.sourcePropertyValue = BardCollegeOfLore.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, classIndex) {
        const tempFeatures = [];
        const level = Number(character.classes.find(c => c.value == "bard").level);
        if (level >= 3) {
            // Cutting Words
            tempFeatures.push({
                name: `${BardCollegeOfLore.name}-cutting-words`,
                title: "Cutting words",
                html: `
                    <p>You learn how to use your wit to distract, confuse, and otherwise sap the confidence and competence of others. When a creature that you can see within 60 feet of you makes an attack roll, an ability check, or a damage roll, you can use your reaction to expend one of your uses of Bardic Inspiration, rolling a Bardic Inspiration die and subtracting the number rolled from the creature's roll. You can choose to use this feature after the creature makes its roll, but before the DM determines whether the attack roll or ability check succeeds or fails, or before the creature deals its damage. The creature is immune if it can't hear you or if it's immune to being charmed.</p>
                    `,
                source: {
                    name: "sub-class",
                    title: BardCollegeOfLore.title
                },
                displayType: "feature-card"
            });
        }
        if (level >= 6) {
            //Additional Magical Secrets
            tempFeatures.push({
                name: `${BardCollegeOfLore.name}-additional-magical-secrets`,
                title: "Additional magical secrets",
                html: `
                    <p>You learn two spells of your choice from any class. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip. The chosen spells count as bard spells for you but don't count against the number of bard spells you know.</p>
                    `,
                source: {
                    name: "sub-class",
                    title: BardCollegeOfLore.title
                },
                displayType: "feature-card"
            });
        }
        if (level >= 14) {
            //Peerless Skill
            tempFeatures.push({
                name: `${BardCollegeOfLore.name}-peerless-skill`,
                title: "Peerless skill",
                html: `
                    <p>When you make an ability check, you can expend one use of Bardic Inspiration. Roll a Bardic Inspiration die and add the number rolled to your ability check. You can choose to do so after you roll the die for the ability check, but before the DM tells you whether you succeed or fail.</p>
                    `,
                source: {
                    name: "sub-class",
                    title: BardCollegeOfLore.title
                },
                displayType: "feature-card"
            });
        }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `subClass-${classIndex}`;
            feature.sourcePropertyValue = BardCollegeOfLore.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex) {
        const tempSpells = [];
        const selectedValues = character.selections
            .find(s => s.name == `${BardCollegeOfLore.name}-additional-magical-secrets-spells`)?.values ?? [];
        for (const selectedValue of selectedValues) {
            tempSpells.push(selectedValue.value);
        }
        for (const spell of tempSpells) {
            spells.push(spell);
        }
    }

    static #getMaxSpellLevel(level) {
        let maxSpellLevel = 1;
        if (level >= 3) {
            maxSpellLevel++;
        }
        if (level >= 5) {
            maxSpellLevel++;
        }
        if (level >= 7) {
            maxSpellLevel++;
        }
        if (level >= 9) {
            maxSpellLevel++;
        }
        if (level >= 12) {
            maxSpellLevel++;
        }
        if (level >= 13) {
            maxSpellLevel++;
        }
        if (level >= 15) {
            maxSpellLevel++;
        }
        if (level >= 17) {
            maxSpellLevel++;
        }
        return maxSpellLevel;
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
