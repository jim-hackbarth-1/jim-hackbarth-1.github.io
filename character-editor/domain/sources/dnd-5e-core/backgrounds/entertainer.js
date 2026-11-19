
export class Entertainer {

    static get name() {
        return "entertainer";
    }

    static get title() {
        return "Entertainer";
    }

    static get htmlPath() {
        return "dnd-5e-core/backgrounds/entertainer.html";
    }

    static get startingEquipment() {
        return `
            <ul>
                <li>A musical instrument (one of your choice)</li>
                <li>The favor of an admirer(love letter, lock of hair, or trinket)</li>
                <li>A costume</li>
                <li>A pouch containing 15 gp</li>
            </ul>
        `;
    }

    static getTraits() {
        return [
            { name: "trait-1", title: "I know a story relevant to almost every situation." },
            { name: "trait-2", title: "Whenever I come to a new place, I collect local rumors and spread gossip." },
            { name: "trait-3", title: "I'm a hopeless romantic, always searching for that 'special someone.'" },
            { name: "trait-4", title: "Nobody stays angry at me or around me for long, since I can defuse any amount of tension." },
            { name: "trait-5", title: "I love a good insult, even one directed at me." },
            { name: "trait-6", title: "I get bitter if I'm not the center of attention." },
            { name: "trait-7", title: "I'll settle for nothing less than perfection." },
            { name: "trait-8", title: "I change my mood or my mind as quickly as I change key in a song." },
        ]
    }

    static getIdeals() {
        return [
            { name: "ideal-1", title: "<b>Beauty.</b> When I perform, I make the world better than it was. (Good)" },
            { name: "ideal-2", title: "<b>Tradition.</b> The stories, legends, and songs of the past must never be forgotten, for they teach us who we are. (Lawful)" },
            { name: "ideal-3", title: "<b>Creativity.</b> The world is in need of new ideas and bold action. (Chaotic)" },
            { name: "ideal-4", title: "<b>Greed.</b> I'm only in it for the money and fame. (Evil)" },
            { name: "ideal-5", title: "<b>People.</b> I like seeing the smiles on people's faces when I perform. That's all that matters. (Neutral)" },
            { name: "ideal-6", title: "<b>Honesty.</b> Art should reflect the soul; it should come from within and reveal who we really are. (Any)" }
        ]
    }

    static getBonds() {
        return [
            { name: "bond-1", title: "My instrument is my most treasured possession, and it reminds me of someone I love." },
            { name: "bond-2", title: "Someone stole my precious instrument, and someday I'll get it back." },
            { name: "bond-3", title: "I want to be famous, whatever it takes." },
            { name: "bond-4", title: "I idolize a hero of the old tales and measure my deeds against that person's." },
            { name: "bond-5", title: "I will do anything to prove myself superior to my hated rival." },
            { name: "bond-6", title: "I would do anything for the other members of my old troupe." }
        ]
    }

    static getFlaws() {
        return [
            { name: "flaw-1", title: "I'll do anything to win fame and renown." },
            { name: "flaw-2", title: "I'm a sucker for a pretty face." },
            { name: "flaw-3", title: "A scandal prevents me from ever going home again. That kind of trouble seems to follow me around." },
            { name: "flaw-4", title: "I once satirized a noble who still wants my head. It was a mistake that I will likely repeat." },
            { name: "flaw-5", title: "I have trouble keeping my true feelings hidden. My sharp tongue lands me in trouble." },
            { name: "flaw-6", title: "Despite my best efforts, I am unreliable to my friends." }
        ]
    }

    static getSelections(character) {
        const selections = [];
        selections.push(character.getSelection(
            character.selections, `${Entertainer.name}-routine`, "Routine", 1));
        selections.push(character.getSelection(
            character.selections, `${Entertainer.name}-instrument`, "Musical instrument", 1, [{ name: "tools" }]));
        return selections;
    }

    static getSelectionOptions(character, selectionName, sources) {
        let options = [];
        if (selectionName == `${Entertainer.name}-routine`) {
            const specialties = [...Entertainer.#routines];
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.getSelectionOptions(specialties, selectedValues, [], "Routine (choose 1) ...");
        }
        if (selectionName == `${Entertainer.name}-instrument`) {
            let instruments = [...sources.find(s => s.name == "tools").options];
            instruments = instruments.filter(i => i.properties && i.properties.some(p => p.name == "musical-instrument"));
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.getSelectionOptions(instruments, selectedValues, [], "Musical instrument (choose 1) ...");
        }
        return options;
    }

    static applyModifiers(character, targetFilters) {
        const modifiers = [];
        modifiers.push({
            name: `${Entertainer.name}-skill-proficiency-acrobatics`,
            title: "Skill proficiency",
            value: "acrobatics",
            target: "skill-proficiency"
        });
        modifiers.push({
            name: `${Entertainer.name}-skill-proficiency-performance`,
            title: "Skill proficiency",
            value: "performance",
            target: "skill-proficiency"
        });
        modifiers.push({
            name: `${Entertainer.name}-tool-proficiency-disguise-kit`,
            title: "Tool proficiency",
            value: "disguise-kit",
            target: "tool-proficiency"
        });

        let instrument = null;
        const instruments = character.selections.find(s => s.name == `${Entertainer.name}-instrument`)?.values ?? [];
        if (instruments.length > 0) {
            instrument = instruments[0];
        }
        if (instrument?.value) {
            modifiers.push({
                name: `${Entertainer.name}-instrument-${instrument.value}`,
                title: "Musical Instrument",
                value: instrument.value,
                target: "tool-proficiency"
            });
        }

        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = "background";
                modifier.sourcePropertyValue = Entertainer.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character) {
        const tempFeatures = [];

        // background
        let routine = null;
        const routines = character.selections.find(s => s.name == `${Entertainer.name}-routine`)?.values ?? [];
        if (routines.length > 0) {
            routine = routines[0];
        }
        const additionalDetails = [];
        if (routine?.value) {
            additionalDetails.push({ title: "Routine", text: routine.text });
        }
        const backgroundHtml = character.getBackgroundHtml(additionalDetails);
        if (backgroundHtml) {
            tempFeatures.push(character.getFeatureCard(Entertainer.name, Entertainer.title, backgroundHtml, Entertainer.title));
        }

        // By Popular Demand
        const popularDemandHtml = `
            <p>
                You can always find a place to perform, usually in an inn or tavern but possibly with a circus, at a theater, or even in a noble's court. At such a place, you receive free lodging and food of a modest or comfortable standard (depending on the quality of the establishment), as long as you perform each night. In addition, your performance makes you something of a local figure. When strangers recognize you in a town where you have performed, they typically take a liking to you.
            </p>
        `;
        tempFeatures.push(character.getFeatureCard(`${Entertainer.name}-by-popular-demand`, "By popular demand", popularDemandHtml));

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "background";
            feature.sourcePropertyValue = Entertainer.name;
            feature.cardSource = Entertainer.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character) {

    }

    static #routines = [
        { name: "routine-1", title: "Actor" },
        { name: "routine-2", title: "Dancer" },
        { name: "routine-3", title: "Fire-eater" },
        { name: "routine-4", title: "Jester" },
        { name: "routine-5", title: "Juggler" },
        { name: "routine-6", title: "Instrumentalist" },
        { name: "routine-7", title: "Poet" },
        { name: "routine-8", title: "Singer" },
        { name: "routine-9", title: "Storyteller" },
        { name: "routine-10", title: "Tumbler" }
    ];

}
