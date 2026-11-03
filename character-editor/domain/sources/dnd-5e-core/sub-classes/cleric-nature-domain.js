
export class ClericNatureDomain {

    static get name() {
        return "cleric-nature-domain";
    }

    static get title() {
        return "Nature Domain";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-classes/cleric-nature-domain.html";
    }

    static get className() {
        return "cleric";
    }

    static getSelections(character, classIndex) {
        const selections = [];
        selections.push(character.getSelection(
            character.selections, `${ClericNatureDomain.name}-skill`, `${ClericNatureDomain.title} - Skill`, 1, [{ name: "skills" }]));
        selections.push(character.getSelection(
            character.selections, `${ClericNatureDomain.name}-cantrip`, `${ClericNatureDomain.title} - Cantrip`, 1, [{ name: "spells" }]));
        return selections;
    }

    static getSelectionOptions(character, classIndex, selectionName, sources) {
        let options = [];
        if (selectionName == `${ClericNatureDomain.name}-skill`) {
            const natureSkills = ["animal-handling", "nature", "survival"];
            let skills = [...sources.find(s => s.name == "skills").options];
            skills = skills.filter(s => natureSkills.includes(s.name));
            for (const skill of skills) {
                skill.data = skill.ability;
            }
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            const selectedElsewhere = character.modifiers
                .filter(m => m.target == "skill-proficiency" && !selectedValues.some(sv => sv.value == m.value))
                .map(m => m.value);
            options = character
                .getSelectionOptions(skills, selectedValues, selectedElsewhere, `${ClericNatureDomain.title} - Skill (choose 1) ...`);
            for (const option of options) {
                option.noteText = option.data;
            }
        }
        if (selectionName == `${ClericNatureDomain.name}-cantrip`) {
            let spells = [...sources.find(s => s.name == "spells").options];
            spells = spells.filter(s => s.classes.includes("druid") && Number(s.level) == 0);
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.getSelectionOptions(
                spells, selectedValues, [], `${ClericNatureDomain.title} - Cantrip (choose 1) ...`);
        }
        return options;
    }

    static applyModifiers(character, classIndex, targetFilters) {
        const modifiers = [];
        const level = Number(character.classes.find(c => c.value == "cleric").level);

        if (level < 1) {
            character.removeSelection(`${ClericNatureDomain.name}-skill`);
            character.removeSelection(`${ClericNatureDomain.name}-cantrip`);
        }

        if (level >= 1) {
            modifiers.push({
                name: `${ClericNatureDomain.name}-armor-proficiency-heavy-armor`,
                title: "Armor proficiency",
                value: "heavy-armor",
                target: "armor-proficiency"
            });

            const skills = character.selections.find(s => s.name == `${ClericNatureDomain.name}-skill`)?.values ?? [];
            for (const skill of skills) {
                if (skill.value) {
                    modifiers.push({
                        name: `${ClericNatureDomain.name}-skill-proficiency-${skill.value}`,
                        title: "Skill proficiency",
                        value: skill.value,
                        target: "skill-proficiency"
                    });
                }
            }
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `subClass-${classIndex}`;
                modifier.sourcePropertyValue = ClericNatureDomain.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, classIndex) {

        const tempFeatures = [];
        const level = Number(character.classes.find(c => c.value == "cleric").level);

        // Channel Divinity: Charm Animals and Plants
        if (level >= 2) {
            const charmHtml = `
                <p>
                    You can use your Channel Divinity to charm animals and plants.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(
                `${ClericNatureDomain.name}-charm-animals-and-plants`, "Channel Divinity: Charm Animals and Plants", charmHtml));
        }

        // Dampen Elements
        if (level >= 6) {
            const dampenHtml = `
                <p>
                    When you or a creature within 30 feet of you takes acid, cold, fire, lightning, or thunder damage, you can use your reaction to grant resistance to the creature against that instance of the damage.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${ClericNatureDomain.name}-dampen-elements`, "Dampen Elements", dampenHtml));
        }

        // Divine Strike
        if (level >= 8) {
            let damageDice = 1;
            if (level >= 14) {
                damageDice = 2;
            }
            const divineStrikeHtml = `
                <p>
                    You gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra ${damageDice}d8 cold, fire, or lightning damage (your choice) to the target.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${ClericNatureDomain.name}-divine-strike`, "Divine Strike", divineStrikeHtml));
        }

        // Master of Nature
        if (level >= 17) {
            const masterOfNatureHtml = `
                <p>
                    You gain the ability to command animals and plant creatures. While creatures are charmed by your Charm Animals and Plants feature, you can take a bonus action on your turn to verbally command what each of those creatures will do on its next turn.
                </p>
            `;
            tempFeatures.push(character.getFeatureCard(`${ClericNatureDomain.name}-master-of-naturee`, "Master of Nature", masterOfNatureHtml));
        }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `subClass-${classIndex}`;
            feature.sourcePropertyValue = ClericNatureDomain.name;
            feature.cardSource = ClericNatureDomain.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex) {
        const characterClass = character.classes.find(c => c.value == "cleric");
        const tempSpells = [];
        if (characterClass.level >= 1) {
            tempSpells.push("animal-friendship");
            tempSpells.push("speak-with-animals");
        }
        if (characterClass.level >= 3) {
            tempSpells.push("barkskin");
            tempSpells.push("spike-growth");
        }
        if (characterClass.level >= 5) {
            tempSpells.push("plant-growth");
            tempSpells.push("wind-wall");
        }
        if (characterClass.level >= 7) {
            tempSpells.push("dominate-beast");
            tempSpells.push("grasping-vine");
        }
        if (characterClass.level >= 9) {
            tempSpells.push("insect-plague");
            tempSpells.push("tree-stride");
        }

        let cantrip = null;
        const cantrips = character.selections.find(s => s.name == `${ClericNatureDomain.name}-cantrip`)?.values ?? [];
        if (cantrips.length > 0) {
            cantrip = cantrips[0].value;
        }
        if (cantrip) {
            tempSpells.push(cantrip);
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
            ClericNatureDomain.#addSpell("animal-friendship", allSpells, classSpellCastingInfo);
            ClericNatureDomain.#addSpell("speak-with-animals", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 3) {
            ClericNatureDomain.#addSpell("barkskin", allSpells, classSpellCastingInfo);
            ClericNatureDomain.#addSpell("spike-growth", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 5) {
            ClericNatureDomain.#addSpell("plant-growth", allSpells, classSpellCastingInfo);
            ClericNatureDomain.#addSpell("wind-wall", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 7) {
            ClericNatureDomain.#addSpell("dominate-beast", allSpells, classSpellCastingInfo);
            ClericNatureDomain.#addSpell("grasping-vine", allSpells, classSpellCastingInfo);
        }
        if (characterClass.level >= 9) {
            ClericNatureDomain.#addSpell("insect-plague", allSpells, classSpellCastingInfo);
            ClericNatureDomain.#addSpell("tree-stride", allSpells, classSpellCastingInfo);
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
