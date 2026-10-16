
export class Hermit {

    static get name() {
        return "hermit";
    }

    static get title() {
        return "Hermit";
    }

    static get htmlPath() {
        return "dnd-5e-core/backgrounds/hermit.html";
    }

    static get startingEquipment() {
        return `
            <ul>
                <li>A scroll case stuffed full of notes from your studies or prayers</li>
                <li>A winter blanket</li>
                <li>A set of common clothes</li>
                <li>an herbalism kit, and 5gp</li>
            </ul>
        `;
    }

    static getTraits() {
        return [
            { name: "trait-1", title: `<p ${Hermit.#selectionStyle}>I've been isolated for so long that I rarely speak, preferring gestures and the occasional grunt.</p>` },
            { name: "trait-2", title: `<p ${Hermit.#selectionStyle}>I am utterly serene, even in the face of disaster.</p>` },
            { name: "trait-3", title: `<p ${Hermit.#selectionStyle}>The leader of my community had something wise to say on every topic, and I am eager to share that wisdom.</p>`},
            { name: "trait-4", title: `<p ${Hermit.#selectionStyle}>I feel tremendous empathy for all who suffer.</p>` },
            { name: "trait-5", title: `<p ${Hermit.#selectionStyle}>I'm oblivious to etiquette and social expectations.</p>` },
            { name: "trait-6", title: `<p ${Hermit.#selectionStyle}>I connect everything that happens to me to a grand, cosmic plan.</p>` },
            { name: "trait-7", title: `<p ${Hermit.#selectionStyle}>I often get lost in my own thoughts and contemplation, becoming oblivious to my surroundings.</p>` },
            { name: "trait-8", title: `<p ${Hermit.#selectionStyle}>I am working on a grand philosophical theory and love sharing my ideas.</p>` },
        ]
    }

    static getIdeals() {
        return [
            { name: "ideal-1", title: `<p ${Hermit.#selectionStyle}>Greater Good. My gifts are meant to be shared with all, not used for my own benefit. (Good)</p>` },
            { name: "ideal-2", title: `<p ${Hermit.#selectionStyle}>Logic. Emotions must not cloud our sense of what is right and true, or our logical thinking. (Lawful)</p>`},
            { name: "ideal-3", title: `<p ${Hermit.#selectionStyle}>Free Thinking. Inquiry and curiosity are the pillars of progress. (Chaotic)</p>` },
            { name: "ideal-4", title: `<p ${Hermit.#selectionStyle}>Power. Solitude and contemplation are paths toward mystical or magical power. (Evil)</p>` },
            { name: "ideal-5", title: `<p ${Hermit.#selectionStyle}>Live and Let Live. Meddling in the affairs of others only causes trouble. (Neutral)</p>` },
            { name: "ideal-6", title: `<p ${Hermit.#selectionStyle}>Self-Knowledge. If you know yourself, there's nothing left to know. (Any)</p>` }
        ]
    }

    static getBonds() {
        return [
            { name: "bond-1", title: `<p ${Hermit.#selectionStyle}>Nothing is more important than the other members of my hermitage, order, or association.</p>` },
            { name: "bond-2", title: `<p ${Hermit.#selectionStyle}>I entered seclusion to hide from the ones who might still be hunting me. I must someday confront them.</p>` },
            { name: "bond-3", title: `<p ${Hermit.#selectionStyle}>I'm still seeking the enlightenment I pursued in my seclusion, and it still eludes me.</p>` },
            { name: "bond-4", title: `<p ${Hermit.#selectionStyle}>I entered seclusion because I loved someone I could not have.</p>` },
            { name: "bond-5", title: `<p ${Hermit.#selectionStyle}>Should my discovery come to light, it could bring ruin to the world.</p>` },
            { name: "bond-6", title: `<p ${Hermit.#selectionStyle}>My isolation gave me great insight into a great evil that only I can destroy.</p>` }
        ]
    }

    static getFlaws() {
        return [
            { name: "flaw-1", title: `<p ${Hermit.#selectionStyle}>Now that I've returned to the world, I enjoy its delights a little too much.</p>` },
            { name: "flaw-2", title: `<p ${Hermit.#selectionStyle}>I harbor dark, bloodthirsty thoughts that my isolation and meditation failed to quell.</p>` },
            { name: "flaw-3", title: `<p ${Hermit.#selectionStyle}>I am dogmatic in my thoughts and philosophy.</p>` },
            { name: "flaw-4", title: `<p ${Hermit.#selectionStyle}>I let my need to win arguments overshadow friendships and harmony.</p>` },
            { name: "flaw-5", title: `<p ${Hermit.#selectionStyle}>I'd risk too much to uncover a lost bit of knowledge.</p>` },
            { name: "flaw-6", title: `<p ${Hermit.#selectionStyle}>I like keeping secrets and won't share them with anyone.</p>` }
        ]
    }

    static getSelections(character) {
        const selectionName = "hermit-language";
        const currentSelections = character.selections.find(s => s.name == selectionName)?.values ?? [];
        if (currentSelections.length == 0) {
            currentSelections.push({ value: null, text: "Choose a language ..." });
        }
        return [
            {
                name: selectionName,
                title: "Language",
                maxSelections: 1,
                sources: [{name: "language"}],
                currentSelections: currentSelections
            }
        ];
    }

    static getSelectionOptions(character, selectionName, sources) {
        let options = [];
        if (selectionName == "hermit-language") {
            options = [...sources.find(s => s.name == "language").options];
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            for (const option of options) {
                option.noteText = option.source.title;
                option.isSelected = (selectedValues.includes(option.value));
            }
            options = Hermit.#sortOptions(options, "text");
            options.unshift({ value: null, text: "Choose a language ..." });
        }
        return options;
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

    static applyAbilityScoreModifiers(character) {

    }

    static applyModifiers(character) {

        const modifiers = [];
        modifiers.push({
            name: "hermit-skill-proficiency-medicine",
            target: "skill-proficiency",
            value: "medicine",
            title: Hermit.title
        });
        modifiers.push({
            name: "hermit-skill-proficiency-religion",
            target: "skill-proficiency",
            value: "religion",
            title: Hermit.title
        });
        modifiers.push({
            name: "hermit-tool-proficiency-herbalism-kit",
            target: "tool-proficiency",
            value: "herbalism-kit",
            title: Hermit.title
        });

        let language = null;
        const languages = character.selections.find(s => s.name == "hermit-language")?.values ?? [];
        if (languages.length > 0) {
            language = languages[0];
        }
        if (language) {
            modifiers.push({
                name: `hermit-language-${language}`,
                target: "language",
                value: language,
                title: Hermit.title
            });
        }

        for (const modifier of modifiers) {
            modifier.sourcePropertyName = "background";
            modifier.sourcePropertyValue = Hermit.name;
            character.addModifier(modifier);
        }

    }

    static applyFeatures(features, character) {
        const tempFeatures = [];
        tempFeatures.push({
            name: "hermit-discovery",
            title: "Discovery",
            html: "<p>The quiet seclusion of your extended hermitage gave you access to a unique and powerful discovery. The exact nature of this revelation depends on the nature of your seclusion. It might be a great truth about the cosmos, the deities, the powerful beings of the outer planes, or the forces of nature. It could be a site that no one else has ever seen. You might have uncovered a fact that has long been forgotten, or unearthed some relic of the past that could rewrite history. It might be information that would be damaging to the people who or consigned you to exile, and hence the reason for your return to society.</p>",
            source: {
                name: "background",
                title: Hermit.title
            },
            displayType: "feature-card",
        });
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "background";
            feature.sourcePropertyValue = Hermit.name
            features.push(feature);
        }
    }

    static applySpells(spells, character) {

    }

    static #selectionStyle = "style='font-family: Calibri, sans-serif;'"

}
