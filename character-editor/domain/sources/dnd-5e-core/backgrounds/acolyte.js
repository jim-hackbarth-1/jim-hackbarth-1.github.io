
export class Acolyte {

    static get name() {
        return "acolyte";
    }

    static get title() {
        return "Acolyte";
    }

    static get htmlPath() {
        return "dnd-5e-core/backgrounds/acolyte.html";
    }

    static get startingEquipment() {
        return `
            <ul>
                <li>A holy symbol (a gift to you when you entered the priesthood)</li>
                <li>A prayer book or prayer wheel</li>
                <li>5 sticks of incense</li>
                <li>A set of common clothes</li>
                <li>A pouch containing 15 gp</li>
            </ul>
        `;
    }

    static getTraits() {
        return [
            { name: "trait-1", title: "I idolize a particular hero of my faith, and constantly refer to that person’s deeds and example." },
            { name: "trait-2", title: "I can find common ground between the fiercest enemies, empathizing with them and always working toward peace." },
            { name: "trait-3", title: "I see omens in every event and action. The gods try to speak to us, we just need to listen." },
            { name: "trait-4", title: "Nothing can shake my optimistic attitude." },
            { name: "trait-5", title: "I quote (or misquote) sacred texts and proverbs in almost every situation." },
            { name: "trait-6", title: "I am tolerant (or intolerant) of other faiths and respect (or condemn) the worship of other gods." },
            { name: "trait-7", title: "I’ve enjoyed fine food, drink, and high society among my temple’s elite. Rough living grates on me." },
            { name: "trait-8", title: "I’ve spent so long in the temple that I have little practical experience dealing with people in the outside world." },
        ]
    }

    static getIdeals() {
        return [
            { name: "ideal-1", title: "<b>Tradition.</b> The ancient traditions of worship and sacrifice must be preserved and upheld. (Lawful)" },
            { name: "ideal-2", title: "<b>Charity.</b> I always try to help those in need, no matter what the personal cost. (Good)" },
            { name: "ideal-3", title: "<b>Change.</b> We must help bring about the changes the gods are constantly working in the world. (Chaotic)" },
            { name: "ideal-4", title: "<b>Power.</b> I hope to one day rise to the top of my faith’s religious hierarchy. (Lawful)" },
            { name: "ideal-5", title: "<b>Faith.</b> I trust that my deity will guide my actions. I have faith that if I work hard, things will go well. (Lawful)" },
            { name: "ideal-6", title: "<b>Aspiration.</b> I seek to prove myself worthy of my god’s favor by matching my actions against his or her teachings. (Any)" }
        ]
    }

    static getBonds() {
        return [
            { name: "bond-1", title: "I would die to recover an ancient relic of my faith that was lost long ago." },
            { name: "bond-2", title: "I will someday get revenge on the corrupt temple hierarchy who branded me a heretic." },
            { name: "bond-3", title: "I owe my life to the priest who took me in when my parents died." },
            { name: "bond-4", title: "Everything I do is for the common people." },
            { name: "bond-5", title: "I will do anything to protect the temple where I served." },
            { name: "bond-6", title: "I seek to preserve a sacred text that my enemies consider heretical and seek to destroy." }
        ]
    }

    static getFlaws() {
        return [
            { name: "flaw-1", title: "I judge others harshly, and myself even more severely." },
            { name: "flaw-2", title: "I put too much trust in those who wield power within my temple’s hierarchy." },
            { name: "flaw-3", title: "My piety sometimes leads me to blindly trust those that profess faith in my god." },
            { name: "flaw-4", title: "I am inflexible in my thinking." },
            { name: "flaw-5", title: "I am suspicious of strangers and expect the worst of them." },
            { name: "flaw-6", title: "Once I pick a goal, I become obsessed with it to the detriment of everything else in my life." }
        ]
    }

    static getSelections(character) {
        const selections = [];
        selections.push(character.getSelection(
            character.selections, `${Acolyte.name}-languages`, "Languages", 2, [{ name: "languages" }]));
        return selections;
    }

    static getSelectionOptions(character, selectionName, sources) {
        let options = [];
        if (selectionName == `${Acolyte.name}-languages`) {
            const languages = [...sources.find(s => s.name == "languages").options];
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            const selectedElsewhere = character.modifiers
                .filter(m => m.target == "language" && !selectedValues.some(sv => sv.value == m.value?.value))
                .map(m => m.value);
            options = character.getSelectionOptions(
                languages, selectedValues, selectedElsewhere, "Languages (choose 2) ...");
        }
        return options;
    }

    static applyModifiers(character, targetFilters) {
        const modifiers = [];
        modifiers.push({
            name: `${Acolyte.name}-skill-proficiency-insight`,
            title: "Skill proficiency",
            value: "medicine",
            target: "skill-proficiency"
        });
        modifiers.push({
            name: `${Acolyte.name}-skill-proficiency-religion`,
            title: "Skill proficiency",
            value: "religion",
            target: "skill-proficiency"
        });

        const languages = character.selections.find(s => s.name == `${Acolyte.name}-languages`)?.values ?? [];
        for (const language of languages) {
            if (language.value) {
                modifiers.push({
                    name: `${Acolyte.name}-language-${language.value}`,
                    title: "Language",
                    value: language,
                    target: "language"
                });
            }
        }

        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = "background";
                modifier.sourcePropertyValue = Acolyte.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character) {
        const tempFeatures = [];

        // background
        const backgroundHtml = character.getBackgroundHtml();
        if (backgroundHtml) {
            tempFeatures.push(character.getFeatureCard(Acolyte.name, Acolyte.title, backgroundHtml, Acolyte.title));
        }

        // shelter of the faithful
        const shelterHtml = `
            <p>
                As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith, though you must provide any material components needed for spells. Those who share your religion will support you (but only you) at a modest lifestyle.
            </p>
        `;
        tempFeatures.push(character.getFeatureCard(`${Acolyte.name}-shelter-of-the-faithful`, "Shelter of the Faithful", shelterHtml));

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "background";
            feature.sourcePropertyValue = Acolyte.name;
            feature.cardSource = Acolyte.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character) {

    }

}
