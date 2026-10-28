
export class Elf {

    static get name() {
        return "elf";
    }

    static get title() {
        return "Elf";
    }

    static get htmlPath() {
        return "dnd-5e-core/races/elf.html";
    }

    static get speed() {
        return 30;
    }

    static get size() {
        return "medium";
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
            name: `${Elf.name}-ability-score-modifier-dexterity`,
            title: "Ability score",
            value: 2,
            target: "ability-score:dexterity"
        });
        modifiers.push({
            name: `${Elf.name}-skill-proficiency-perception`,
            title: "Skill proficiency",
            value: "perception",
            target: "skill-proficiency"
        });
        modifiers.push({
            name: `${Elf.name}-languages-common`,
            title: "Language",
            value: { value: "common", text: "Common" },
            target: "language"
        });
        modifiers.push({
            name: `${Elf.name}-languages-elvish`,
            title: "Language",
            value: { value: "elvish", text: "Elvish" },
            target: "language"
        });

        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = "race";
                modifier.sourcePropertyValue = Elf.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character) {
        const tempFeatures = [];

        // Darkvision
        tempFeatures.push({
            name: `${Elf.name}-darkvision`,
            title: "Darkvision",
            html: `
                <p><b>Darkvision.</b> Accustomed to twilit forests and the night sky, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can’t discern color in darkness, only shades of gray.</p>
                `,
            source: {
                name: "race",
                title: Elf.title
            },
            displayType: "feature-card"
        });

        // Fey Ancestry
        tempFeatures.push({
            name: `${Elf.name}-fey-ancestry`,
            title: "Fey Ancestry",
            html: `
                <p><b>Fey Ancestry.</b> You have advantage on saving throws against being charmed, and magic can’t put you to sleep.</p>
                `,
            source: {
                name: "race",
                title: Elf.title
            },
            displayType: "feature-card"
        });

        // Trance
        tempFeatures.push({
            name: `${Elf.name}-trance`,
            title: "Trance",
            html: `
                <p><b>Trance.</b> Elves don’t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. (The Common word for such meditation is “trance.”) While meditating, you can dream after a fashion; such dreams are actually mental exercises that have become reflexive through years of practice. After resting in this way, you gain the same benefit that a human does from 8 hours of sleep.</p>
                `,
            source: {
                name: "race",
                title: Elf.title
            },
            displayType: "feature-card"
        });

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "race";
            feature.sourcePropertyValue = Elf.name
            features.push(feature);
        }
    }

    static applySpells(spells, character) {

    }

}
