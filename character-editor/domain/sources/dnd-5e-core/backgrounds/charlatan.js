
export class Charlatan {

    static get name() {
        return "charlatan";
    }

    static get title() {
        return "Charlatan";
    }

    static get htmlPath() {
        return "dnd-5e-core/backgrounds/charlatan.html";
    }

    static get startingEquipment() {
        return `
            <ul>
                <li>A set of fine clothes</li>
                <li>A disguise kit</li>
                <li>Tools of the con of your choice (ten stoppered bottles filled with colored liquid, a set of weighted dice, a deck of marked cards, or a signet ring of an imaginary duke)</li>
                <li>A pouch containing 15 gp</li>
            </ul>
        `;
    }

    static getTraits() {
        return [
            { name: "trait-1", title: "I fall in and out of love easily, and am always pursuing someone." },
            { name: "trait-2", title: "I have a joke for every occasion, especially occasions where humor is inappropriate." },
            { name: "trait-3", title: "Flattery is my preferred trick for getting what I want." },
            { name: "trait-4", title: "I'm a born gambler who can't resist taking a risk for a potential payoff." },
            { name: "trait-5", title: "I lie about almost everything, even when there's no good reason to." },
            { name: "trait-6", title: "Sarcasm and insults are my weapons of choice." },
            { name: "trait-7", title: "I keep multiple holy symbols on me and invoke whatever deity might come in useful at any given moment." },
            { name: "trait-8", title: "I pocket anything I see that might have some value." },
        ]
    }

    static getIdeals() {
        return [
            { name: "ideal-1", title: "<b>Independence.</b> I am a free spirit — no one tells me what to do. (Chaotic)" },
            { name: "ideal-2", title: "<b>Fairness.</b> I never target people who can't afford to lose a few coins. (Lawful)" },
            { name: "ideal-3", title: "<b>Fairness.</b> I never target people who can't afford to lose a few coins. (Lawful)" },
            { name: "ideal-4", title: "<b>Creativity.</b> I never run the same con twice. (Chaotic)" },
            { name: "ideal-5", title: "<b>Friendship.</b> Material goods come and go.Bonds of friendship last forever. (Good)" },
            { name: "ideal-6", title: "<b>Aspiration.</b> I'm determined to make something of myself. (Any)" }
        ]
    }

    static getBonds() {
        return [
            { name: "bond-1", title: "I fleeced the wrong person and must work to ensure that this individual never crosses paths with me or those I care about." },
            { name: "bond-2", title: "I owe everything to my mentor — a horrible person who's probably rotting in jail somewhere." },
            { name: "bond-3", title: "Somewhere out there, I have a child who doesn't know me. I'm making the world better for them." },
            { name: "bond-4", title: "I come from a noble family, and one day I'll reclaim my lands and title from those who stole them from me." },
            { name: "bond-5", title: "A powerful person killed someone I love.Some day soon, I'll have my revenge." },
            { name: "bond-6", title: "I swindled and ruined a person who didn't deserve it. I seek to atone for my misdeeds but might never be able to forgive myself." }
        ]
    }

    static getFlaws() {
        return [
            { name: "flaw-1", title: "I can't resist a pretty face." },
            { name: "flaw-2", title: "I'm always in debt. I spend my ill-gotten gains on decadent luxuries faster than I bring them in." },
            { name: "flaw-3", title: "I'm convinced that no one could ever fool me the way I fool others." },
            { name: "flaw-4", title: "I'm too greedy for my own good. I can't resist taking a risk if there's money involved." },
            { name: "flaw-5", title: "I can't resist swindling people who are more powerful than me." },
            { name: "flaw-6", title: "I hate to admit it and will hate myself for it, but I'll run and preserve my own hide if the going gets tough." }
        ]
    }

    static getSelections(character) {
        return [];
    }

    static getSelectionOptions(character, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, targetFilters) {
        const modifiers = [];
        modifiers.push({
            name: `${Charlatan.name}-skill-proficiency-deception`,
            title: "Skill proficiency",
            value: "deception",
            target: "skill-proficiency"
        });
        modifiers.push({
            name: `${Charlatan.name}-skill-proficiency-sleight-of-hand`,
            title: "Skill proficiency",
            value: "sleight-of-hand",
            target: "skill-proficiency"
        });
        modifiers.push({
            name: `${Charlatan.name}-tool-proficiency-disguise-kit`,
            title: "Tool proficiency",
            value: "disguise-kit",
            target: "tool-proficiency"
        });
        modifiers.push({
            name: `${Charlatan.name}-tool-proficiency-disguise-kit`,
            title: "Tool proficiency",
            value: "forgery-kit",
            target: "tool-proficiency"
        });
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = "background";
                modifier.sourcePropertyValue = Charlatan.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character) {
        const tempFeatures = [];

        // background
        const backgroundHtml = character.getBackgroundHtml();
        if (backgroundHtml) {
            tempFeatures.push(character.getFeatureCard(Charlatan.name, Charlatan.title, backgroundHtml, Charlatan.title));
        }

        // false identity
        const falseIdentityHtml = `
            <p>
                You have created a second identity that includes documentation, established acquaintances, and disguises that allow you to assume that persona. Additionally, you can forge documents including official papers and personal letters, as long as you have seen an example of the kind of document or the handwriting you are trying to copy.
            </p>
        `;
        tempFeatures.push(character.getFeatureCard(`${Charlatan.name}-false-identity`, "False Identity", falseIdentityHtml));

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "background";
            feature.sourcePropertyValue = Charlatan.name;
            feature.cardSource = Charlatan.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character) {

    }
}
