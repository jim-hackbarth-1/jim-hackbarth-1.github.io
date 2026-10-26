
export class BardCollegeOfSecrets {

    static get name() {
        return "bard-college-of-secrets";
    }

    static get title() {
        return "College of Secrets";
    }

    static get htmlPath() {
        return "lands-of-aedun/sub-classes/bard-college-of-secrets.html";
    }

    static get className() {
        return "bard";
    }

    static getSelections(character, classIndex) {
        const selections = [];
        const level = Number(character.classes.find(c => c.value == "bard").level);
        if (level >= 6) {
            selections.push(character.selectionUtilities.getSelection(
                character.selections,
                `${BardCollegeOfSecrets.name}-languages`,
                `${BardCollegeOfSecrets.title} - Languages`,
                3,
                [{ name: "languages" }]));
        }
        return selections;
    }

    static getSelectionOptions(character, classIndex, selectionName, sources) {
        let options = [];
        if (selectionName == `${BardCollegeOfSecrets.name}-languages`) {
            const languages = [...sources.find(s => s.name == "languages").options];
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            const selectedElsewhere = character.modifiers
                .filter(m => m.target == "language" && !selectedValues.some(sv => sv.value == m.value?.value))
                .map(m => m.value);
            options = character.selectionUtilities.getSelectionOptions(
                languages, selectedValues, selectedElsewhere, `${BardCollegeOfSecrets.title} - Languages (choose 3) ...`);
        }
        return options;
    }

    static applyModifiers(character, classIndex, targetFilters) {
        const modifiers = [];
        const level = Number(character.classes.find(c => c.value == "bard").level);

        if (level < 6) {
            character.removeSelection(`${BardCollegeOfSecrets.name}-languages`);
        }

        if (level >= 3) {
            modifiers.push({
                name: `${BardCollegeOfSecrets.name}-modifier-perception`,
                title: "Skill modifier",
                value: 5,
                target: "skill:perception"
            });
            modifiers.push({
                name: `${BardCollegeOfSecrets.name}-modifier-insight`,
                title: "Skill modifier",
                value: 5,
                target: "skill:insight"
            });
        }
        if (level >= 6) {
            modifiers.push({
                name: `${BardCollegeOfSecrets.name}-modifier-deception`,
                title: "Skill modifier",
                value: 5,
                target: "skill:deception"
            });
            modifiers.push({
                name: `${BardCollegeOfSecrets.name}-modifier-performance`,
                title: "Skill modifier",
                value: 5,
                target: "skill:performance"
            });
        }
        const languages = character.selections.find(s => s.name == `${BardCollegeOfSecrets.name}-languages`)?.values ?? [];
        for (const language of languages) {
            modifiers.push({
                name: `${BardCollegeOfSecrets.name}-language-${language.value}`,
                title: "Language",
                value: language,
                target: "language",
                
                title: BardCollegeOfSecrets.title
            });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `subClass-${classIndex}`;
                modifier.sourcePropertyValue = BardCollegeOfSecrets.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, classIndex) {
        const tempFeatures = [];
        const level = Number(character.classes.find(c => c.value == "bard").level);
        if (level >= 3) {
            // tradecraft
            tempFeatures.push({
                name: `${BardCollegeOfSecrets.name}-tradecraft`,
                title: "Tradecraft",
                html: `
                    <p>You gain the following benefits:</p>
                    <p>
                        <ul>
                            <li>The ability to read lips</li>
                            <li>+5 bonus to Perception and Insight checks</li>
                            <li>You can create written cyphers. Others can’t decipher a coded message you create unless you teach them, or magic is used to decipher the text.</li>
                        </ul>
                    </p>
                    `,
                source: {
                    name: "sub-class",
                    title: BardCollegeOfSecrets.title
                },
                displayType: "feature-card"
            });

            // inspiring word
            tempFeatures.push({
                name: `${BardCollegeOfSecrets.name}-inspiring-word`,
                title: "Inspiring word",
                html: `
                    <p>You gain the ability to use your wit, insight, and magic to inspire confidence and competence in others.  When a creature within 60 feet, that can hear and understand you, makes an attack roll, an ability check, or a damage roll, you can use your reaction to expend one of your uses of Bardic Inspirations, rolling a Bardic Inspiration die and adding the number rolled to the creature’s roll.  This feature can be used after the roll but before the DM has determined whether the attack roll or ability check has succeeded.</p>
                    `,
                source: {
                    name: "sub-class",
                    title: BardCollegeOfSecrets.title
                },
                displayType: "feature-card"
            });
        }
        if (level >= 6) {
            //spycraft
            tempFeatures.push({
                name: `${BardCollegeOfSecrets.name}-spycraft`,
                title: "Spycraft",
                html: `
                    <p>You gain the following additional abilities:</p>
                    <p>
                        <ul>
                            <li>You learn 3 languages of your choice</li>
                            <li>+5 bonus to Deception and Performance checks</li>
                            <li>You can mimic the speech of another person, or the sounds made by other creatures. You must have heard the person speaking for at least one minute.  A successful Insight check contested by your Deception check allows a listener to identify the deception.</li>
                        </ul>
                    </p>
                    `,
                source: {
                    name: "sub-class",
                    title: BardCollegeOfSecrets.title
                },
                displayType: "feature-card"
            });
        }
        if (level >= 14) {
            //Vicious riposte
            tempFeatures.push({
                name: `${BardCollegeOfSecrets.name}-vicious-riposte`,
                title: "Vicious riposte",
                html: `
                    <p>When you are targeted by a melee attack you can use your reaction to cast the Vicious Mockery cantrip targeting the attacker.</p>
                    `,
                source: {
                    name: "sub-class",
                    title: BardCollegeOfSecrets.title
                },
                displayType: "feature-card"
            });
        }

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `subClass-${classIndex}`;
            feature.sourcePropertyValue = BardCollegeOfSecrets.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex) {
        const tempSpells = [];
        const characterClass = character.classes.find(c => c.value == "bard");
        if (characterClass.level >= 14) {
            tempSpells.push("vicious-mockery");
        }
        for (const spell of tempSpells) {
            spells.push(spell);
        }
    }

    static getSpellCastingInfo(character, allSpells, classSpellCastingInfo) {
        return classSpellCastingInfo;
    }

}
