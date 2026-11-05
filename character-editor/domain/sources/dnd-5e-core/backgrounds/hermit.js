
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
            { name: "trait-1", title: `I've been isolated for so long that I rarely speak, preferring gestures and the occasional grunt.` },
            { name: "trait-2", title: `I am utterly serene, even in the face of disaster.` },
            { name: "trait-3", title: `The leader of my community had something wise to say on every topic, and I am eager to share that wisdom.`},
            { name: "trait-4", title: `I feel tremendous empathy for all who suffer.` },
            { name: "trait-5", title: `I'm oblivious to etiquette and social expectations.` },
            { name: "trait-6", title: `I connect everything that happens to me to a grand, cosmic plan.` },
            { name: "trait-7", title: `I often get lost in my own thoughts and contemplation, becoming oblivious to my surroundings.` },
            { name: "trait-8", title: `I am working on a grand philosophical theory and love sharing my ideas.` },
        ]
    }

    static getIdeals() {
        return [
            { name: "ideal-1", title: `<b>Greater Good.</b> My gifts are meant to be shared with all, not used for my own benefit. (Good)` },
            { name: "ideal-2", title: `<b>Logic.</b> Emotions must not cloud our sense of what is right and true, or our logical thinking. (Lawful)`},
            { name: "ideal-3", title: `<b>Free Thinking.</b> Inquiry and curiosity are the pillars of progress. (Chaotic)` },
            { name: "ideal-4", title: `<b>Power.</b> Solitude and contemplation are paths toward mystical or magical power. (Evil)` },
            { name: "ideal-5", title: `<b>Live and Let Live.</b> Meddling in the affairs of others only causes trouble. (Neutral)` },
            { name: "ideal-6", title: `<b>Self-Knowledge.</b> If you know yourself, there's nothing left to know. (Any)` }
        ]
    }

    static getBonds() {
        return [
            { name: "bond-1", title: `Nothing is more important than the other members of my hermitage, order, or association.` },
            { name: "bond-2", title: `I entered seclusion to hide from the ones who might still be hunting me. I must someday confront them.` },
            { name: "bond-3", title: `I'm still seeking the enlightenment I pursued in my seclusion, and it still eludes me.` },
            { name: "bond-4", title: `I entered seclusion because I loved someone I could not have.` },
            { name: "bond-5", title: `Should my discovery come to light, it could bring ruin to the world.` },
            { name: "bond-6", title: `My isolation gave me great insight into a great evil that only I can destroy.` }
        ]
    }

    static getFlaws() {
        return [
            { name: "flaw-1", title: `Now that I've returned to the world, I enjoy its delights a little too much.` },
            { name: "flaw-2", title: `I harbor dark, bloodthirsty thoughts that my isolation and meditation failed to quell.` },
            { name: "flaw-3", title: `I am dogmatic in my thoughts and philosophy.` },
            { name: "flaw-4", title: `I let my need to win arguments overshadow friendships and harmony.` },
            { name: "flaw-5", title: `I'd risk too much to uncover a lost bit of knowledge.` },
            { name: "flaw-6", title: `I like keeping secrets and won't share them with anyone.` }
        ]
    }

    static getSelections(character) {
        const selections = [];
        selections.push(character.getSelection(
            character.selections, `${Hermit.name}-language`, "Language", 1, [{ name: "languages" }]));
        return selections;
    }

    static getSelectionOptions(character, selectionName, sources) {
        let options = [];
        if (selectionName == "hermit-language") {
            const languages = [...sources.find(s => s.name == "languages").options];
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            const selectedElsewhere = character.modifiers
                .filter(m => m.target == "language" && !selectedValues.some(sv => sv.value == m.value?.value))
                .map(m => m.value);
            options = character.getSelectionOptions(
                languages, selectedValues, selectedElsewhere, "Language (choose 1) ...");
        }
        return options;
    }

    static applyModifiers(character, targetFilters) {
        const modifiers = [];
        modifiers.push({
            name: "hermit-skill-proficiency-medicine",
            title: "Skill proficiency",
            value: "medicine",
            target: "skill-proficiency"
        });
        modifiers.push({
            name: "hermit-skill-proficiency-religion",
            title: "Skill proficiency",
            value: "religion",
            target: "skill-proficiency"
        });
        modifiers.push({
            name: "hermit-tool-proficiency-herbalism-kit",
            title: "Tool proficiency",
            value: "herbalism-kit",
            target: "tool-proficiency"
        });

        let language = null;
        const languages = character.selections.find(s => s.name == "hermit-language")?.values ?? [];
        if (languages.length > 0) {
            language = languages[0];
        }
        if (language?.value) {
            modifiers.push({
                name: `hermit-language-${language.value}`,
                title: "Language",
                value: language,
                target: "language"
            });
        }

        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = "background";
                modifier.sourcePropertyValue = Hermit.name;
                character.addModifier(modifier);
            }
        }

    }

    static applyFeatures(features, character) {
        const tempFeatures = [];

        // background
        const backgroundHtml = character.getBackgroundHtml();
        if (backgroundHtml) {
            tempFeatures.push(character.getFeatureCard(Hermit.name, Hermit.title, backgroundHtml, Hermit.title));
        }

        // discovery
        const discoveryHtml = `
            <p>
                The quiet seclusion of your extended hermitage gave you access to a unique and powerful discovery. The exact nature of this revelation depends on the nature of your seclusion. It might be a great truth about the cosmos, the deities, the powerful beings of the outer planes, or the forces of nature. It could be a site that no one else has ever seen. You might have uncovered a fact that has long been forgotten, or unearthed some relic of the past that could rewrite history. It might be information that would be damaging to the people who or consigned you to exile, and hence the reason for your return to society.
            </p>
        `;
        tempFeatures.push(character.getFeatureCard(`${Hermit.name}-discovery`, "Discovery", discoveryHtml));

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "background";
            feature.sourcePropertyValue = Hermit.name;
            feature.cardSource = Hermit.title;
            features.push(feature);
        }
    }

    static applySpells(spells, character) {

    }

}
