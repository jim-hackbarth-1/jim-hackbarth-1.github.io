
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
            const selectionName = `${BardCollegeOfSecrets.name}-languages`;
            const currentSelections = character.selections.find(s => s.name == selectionName)?.values ?? [];
            if (currentSelections.length == 0) {
                currentSelections.push({ value: null, text: "Languages (choose 3) ..." });
            }
            selections.push({
                name: selectionName,
                title: `${BardCollegeOfSecrets.title} - Languages`,
                maxSelections: 3,
                sources: [{ name: "languages" }],
                currentSelections: currentSelections
            });
        }
        return selections;
    }

    static getSelectionOptions(character, classIndex, selectionName, sources) {
        let options = [];
        if (selectionName == `${BardCollegeOfSecrets.name}-languages`) {
            options = [...sources.find(s => s.name == "languages").options];
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            const disabledLanguages = character.modifiers
                .filter(m => m.target == "language" && !selectedValues.some(sv => sv.value == m.value?.name))
                .map(m => m.value?.name);
            for (const option of options) {
                const isDisabled = disabledLanguages.includes(option.value);
                option.isSelected = (selectedValues.some(sv => sv.value == option.value));
                option.isDisabled = isDisabled;
                option.disabledReason = isDisabled ? "Disabled: Language granted by other feature" : ""
            }
            options = BardCollegeOfSecrets.#sortOptions(options, "text");
            options.unshift(
                {
                    value: null,
                    text: "Languages (choose 3) ...",
                    hideCheckbox: true
                });
        }
        return options;
    }

    static applyModifiers(character, classIndex, targetFilters) {
        const modifiers = [];
        const level = Number(character.classes.find(c => c.value == "bard").level);
        if (level >= 3) {
            modifiers.push({
                name: `${BardCollegeOfSecrets.name}-modifier-perception`,
                target: "skill:perception",
                value: 5,
                title: BardCollegeOfSecrets.title
            });
            modifiers.push({
                name: `${BardCollegeOfSecrets.name}-modifier-insight`,
                target: "skill:insight",
                value: 5,
                title: BardCollegeOfSecrets.title
            });
        }
        if (level >= 6) {
            modifiers.push({
                name: `${BardCollegeOfSecrets.name}-modifier-deception`,
                target: "skill:deception",
                value: 5,
                title: BardCollegeOfSecrets.title
            });
            modifiers.push({
                name: `${BardCollegeOfSecrets.name}-modifier-performance`,
                target: "skill:performance",
                value: 5,
                title: BardCollegeOfSecrets.title
            });
        }
        const languages = character.selections.find(s => s.name == `${BardCollegeOfSecrets.name}-languages`)?.values ?? [];
        for (const language of languages) {
            modifiers.push({
                name: `${BardCollegeOfSecrets.name}-language-${language.value}`,
                target: "language",
                value: language,
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
