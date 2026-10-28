
export class ElfDawn {

    static get name() {
        return "elf-dawn";
    }

    static get title() {
        return "Dawn Elf";
    }

    static get htmlPath() {
        return "lands-of-aedun/sub-races/elf-dawn.html";
    }

    static get race() {
        return "elf";
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
            name: `${ElfDawn.name}-ability-score-modifier-strength`,
            title: "Ability score",
            value: 1,
            target: "ability-score:strength"
        });
        modifiers.push({
            name: `${ElfDawn.name}-weapon-proficiency-war-pick`,
            title: "Dawn Elf Weapon Training",
            value: "war-pick",
            target: "weapon-proficiency"
        });
        modifiers.push({
            name: `${ElfDawn.name}-weapon-proficiency-scimitar`,
            title: "Dawn Elf Weapon Training",
            value: "scimitar",
            target: "weapon-proficiency"
        });
        modifiers.push({
            name: `${ElfDawn.name}-weapon-proficiency-longbow`,
            title: "Dawn Elf Weapon Training",
            value: "longbow",
            target: "weapon-proficiency"
        });
        modifiers.push({
            name: `${ElfDawn.name}-weapon-proficiency-shortbow`,
            title: "Dawn Elf Weapon Training",
            value: "shortbow",
            target: "weapon-proficiency"
        });
        modifiers.push({
            name: `${ElfDawn.name}-skill-bonus-animal-handling`,
            title: "Animal Kinship",
            value: 5,
            target: "skill:animal-handling"
        });
        modifiers.push({
            name: `${ElfDawn.name}-languages-common`,
            title: "Language",
            value: { value: "common", text: "Common" },
            target: "language"
        });
        modifiers.push({
            name: `${ElfDawn.name}-languages-wullah`,
            title: "Language",
            value: { value: "wullah", text: "Wullah" },
            target: "language"
        });
       
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = "sub-race";
                modifier.sourcePropertyValue = ElfDawn.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character) {

        const tempFeatures = [];

        // Dawn Elf Horsemanship
        tempFeatures.push({
            name: `${ElfDawn.name}-horsemanship`,
            title: "Dawn Elf Horsemanship",
            html: `
                <p><b>Dawn Elf Horsemanship.</b> Mount or dismount with no movement cost and gain advantage on any effect that might cause the rider to be dismounted.</p>
                `,
            source: {
                name: "sub-race",
                title: ElfDawn.title
            },
            displayType: "feature-card"
        });

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "subRace";
            feature.sourcePropertyValue = ElfDawn.name
            features.push(feature);
        }
    }

    static applySpells(spells, character) {

    }

}
