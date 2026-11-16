
export class Criminal {

    static get name() {
        return "criminal";
    }

    static get title() {
        return "Criminal";
    }

    static get htmlPath() {
        return "dnd-5e-core/backgrounds/criminal.html";
    }

    static get startingEquipment() {
        return `
            <ul>
                <li>A set of dark common clothes including a hood</li>
                <li>A crowbar</li>
                <li>A pouch containing 15 gp</li>
            </ul>
        `;
    }

    static getTraits() {
        return [
            { name: "trait-1", title: "I always have a plan for what to do when things go wrong." },
            { name: "trait-2", title: "I am always calm, no matter what the situation. I never raise my voice or let my emotions control me." },
            { name: "trait-3", title: "The first thing I do in a new place is note the locations of everything valuable — or where such things could be hidden." },
            { name: "trait-4", title: "I would rather make a new friend than a new enemy." },
            { name: "trait-5", title: "I am incredibly slow to trust. Those who seem the fairest often have the most to hide." },
            { name: "trait-6", title: "I don’t pay attention to the risks in a situation. Never tell me the odds." },
            { name: "trait-7", title: "The best way to get me to do something is to tell me I can’t do it." },
            { name: "trait-8", title: "I blow up at the slightest insult." },
        ]
    }

    static getIdeals() {
        return [
            { name: "ideal-1", title: "<b>Honor.</b> I don’t steal from others in the trade. (Lawful)" },
            { name: "ideal-2", title: "<b>Freedom.</b> Chains are meant to be broken, as are those who would forge them. (Chaotic)" },
            { name: "ideal-3", title: "<b>Charity.</b> I steal from the wealthy so that I can help people in need. (Good)" },
            { name: "ideal-4", title: "<b>Greed.</b> I will do whatever it takes to become wealthy. (Evil)" },
            { name: "ideal-5", title: "<b>People.</b> I’m loyal to my friends, not to any ideals, and everyone else can take a trip down the Styx for all I care. (Neutral)" },
            { name: "ideal-6", title: "<b>Redemption.</b> There’s a spark of good in everyone. (Good)" }
        ]
    }

    static getBonds() {
        return [
            { name: "bond-1", title: "I'm trying to pay off an old debt I owe to a generous benefactor." },
            { name: "bond-2", title: "My ill-gotten gains go to support my family." },
            { name: "bond-3", title: "Something important was taken from me, and I aim to steal it back." },
            { name: "bond-4", title: "I will become the greatest thief that ever lived." },
            { name: "bond-5", title: "I'm guilty of a terrible crime. I hope I can redeem myself for it." },
            { name: "bond-6", title: "Someone I loved died because of a mistake I made. That will never happen again." }
        ]
    }

    static getFlaws() {
        return [
            { name: "flaw-1", title: "When I see something valuable, I can’t think about anything but how to steal it." },
            { name: "flaw-2", title: "When faced with a choice between money and my friends, I usually choose the money." },
            { name: "flaw-3", title: "If there’s a plan, I’ll forget it. If I don’t forget it, I’ll ignore it." },
            { name: "flaw-4", title: "I have a 'tell' that reveals when I’m lying." },
            { name: "flaw-5", title: "I turn tail and run when things look bad." },
            { name: "flaw-6", title: "An innocent person is in prison for a crime that I committed. I’m okay with that."}
        ]
    }

    static getSelections(character) {
        const selections = [];
        selections.push(character.getSelection(
            character.selections, `${Criminal.name}-specialty`, "Specialty", 1));
        selections.push(character.getSelection(
            character.selections, `${Criminal.name}-gaming-set`, "Gaming set", 1, [{ name: "tools" }]));
        return selections;
    }

    static getSelectionOptions(character, selectionName, sources) {
        let options = [];
        if (selectionName == `${Criminal.name}-specialty`) {
            const specialties = [...Criminal.#specialties];
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.getSelectionOptions(specialties, selectedValues, [], "Specialty (choose 1) ...");
        }
        if (selectionName == `${Criminal.name}-gaming-set`) {
            let gamingSets = [...sources.find(s => s.name == "tools").options];
            gamingSets = gamingSets.filter(gs => gs.properties && gs.properties.some(p => p.name == "gaming-set"));
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.getSelectionOptions(gamingSets, selectedValues, [], "Gaming set (choose 1) ...");
        }
        return options;
    }

    static applyModifiers(character, targetFilters) {

        //     <b>Tool Proficiencies:</b> One type of gaming set, thieves’ tools

        const modifiers = [];
        modifiers.push({
            name: `${Criminal.name}-skill-proficiency-deception`,
            title: "Skill proficiency",
            value: "deception",
            target: "skill-proficiency"
        });
        modifiers.push({
            name: `${Criminal.name}-skill-proficiency-stealth`,
            title: "Skill proficiency",
            value: "stealth",
            target: "skill-proficiency"
        });
        modifiers.push({
            name: `${Criminal.name}-tool-proficiency-thieves-tools`,
            title: "Tool proficiency",
            value: "thieves-tools",
            target: "tool-proficiency"
        });

        let gamingSet = null;
        const gamingSets = character.selections.find(s => s.name == `${Criminal.name}-gaming-set`)?.values ?? [];
        if (gamingSets.length > 0) {
            gamingSet = gamingSets[0];
        }
        if (gamingSet?.value) {
            modifiers.push({
                name: `${Criminal.name}-gaming-set-${gamingSet.value}`,
                title: "Gaming set",
                value: gamingSet.value,
                target: "tool-proficiency"
            });
        }

        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = "background";
                modifier.sourcePropertyValue = Criminal.name;
                character.addModifier(modifier);
            }
        }

    }

    static applyFeatures(features, character) {
        const tempFeatures = [];

        // background
        let specialty = null;
        const specialties = character.selections.find(s => s.name == `${Criminal.name}-specialty`)?.values ?? [];
        if (specialties.length > 0) {
            specialty = specialties[0];
        }
        const additionalDetails = [];
        if (specialty?.value) {
            additionalDetails.push({ title: "Specialty", text: specialty.text });
        }
        const backgroundHtml = character.getBackgroundHtml(additionalDetails);
        if (backgroundHtml) {
            tempFeatures.push(character.getFeatureCard(Criminal.name, Criminal.title, backgroundHtml, Criminal.title));
        }

        // discovery
        const criminalContactHtml = `
            <p>
                You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, even over great distances; specifically, you know the local messengers, corrupt caravan masters, and seedy sailors who can deliver messages for you.
            </p>
        `;
        tempFeatures.push(character.getFeatureCard(`${Criminal.name}-criminal-contact`, "Criminal contact", criminalContactHtml));

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "background";
            feature.sourcePropertyValue = Criminal.name;
            feature.cardSource = Criminal.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character) {

    }

    static #specialties = [
        { name: "specialty-1", title: "Blackmailer" },
        { name: "specialty-2", title: "Burglar" },
        { name: "specialty-3", title: "Enforcer" },
        { name: "specialty-4", title: "Fence" },
        { name: "specialty-5", title: "Highway robber" },
        { name: "specialty-6", title: "Hired killer" },
        { name: "specialty-7", title: "Pickpocket" },
        { name: "specialty-8", title: "Smuggler" }
    ];

}
