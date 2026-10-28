
export class ElfHigh {

    static get name() {
        return "elf-high";
    }

    static get title() {
        return "High Elf";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-races/elf-high.html";
    }

    static get race() {
        return "elf";
    }

    static getSelections(character) {
        const selections = [];
        selections.push(character.selectionUtilities.getSelection(
            character.selections, `${ElfHigh.name}-language`, "Language", 1, [{ name: "languages" }]));
        selections.push(character.selectionUtilities.getSelection(
            character.selections, `${ElfHigh.name}-cantrip`, "Cantrip", 1, [{ name: "spells" }]));
        return selections;
    }

    static getSelectionOptions(character, selectionName, sources) {
        let options = [];
        if (selectionName == `${ElfHigh.name}-language`) {
            const languages = [...sources.find(s => s.name == "languages").options];
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            const selectedElsewhere = character.modifiers
                .filter(m => m.target == "language" && !selectedValues.some(sv => sv.value == m.value?.value))
                .map(m => m.value);
            options = character.selectionUtilities.getSelectionOptions(
                languages, selectedValues, selectedElsewhere, "Language (choose 1) ...");
        }
        if (selectionName == `${ElfHigh.name}-cantrip`) {
            let spells = [...sources.find(s => s.name == "spells").options];
            spells = spells.filter(s => s.classes.includes("wizard") && Number(s.level) == 0);
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.selectionUtilities.getSelectionOptions(
                spells, selectedValues, [], "Cantrip (choose 1) ...");
        }
        return options;
    }

    static applyModifiers(character, targetFilters) {

        const modifiers = [];
        modifiers.push({
            name: `${ElfHigh.name}-ability-score-modifier-intelligence`,
            title: "Ability score",
            value: 1,
            target: "ability-score:intelligence"
        });
        modifiers.push({
            name: `${ElfHigh.name}-weapon-proficiency-longsword`,
            title: "High Elf Weapon Training",
            value: "longsword",
            target: "weapon-proficiency"
        });
        modifiers.push({
            name: `${ElfHigh.name}-weapon-proficiency-shortsword`,
            title: "High Elf Weapon Training",
            value: "shortsword",
            target: "weapon-proficiency"
        });
        modifiers.push({
            name: `${ElfHigh.name}-weapon-proficiency-shortbow`,
            title: "High Elf Weapon Training",
            value: "shortbow",
            target: "weapon-proficiency"
        });
        modifiers.push({
            name: `${ElfHigh.name}-weapon-proficiency-longbow`,
            title: "High Elf Weapon Training",
            value: "longbow",
            target: "weapon-proficiency"
        });

        let language = null;
        const languages = character.selections.find(s => s.name == `${ElfHigh.name}-language`)?.values ?? [];
        if (languages.length > 0) {
            language = languages[0];
        }
        if (language) {
            modifiers.push({
                name: `${ElfHigh.name}-language-${language}`,
                title: "Language",
                value: language,
                target: "language"
            });
        }

        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = "sub-race";
                modifier.sourcePropertyValue = ElfHigh.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character) {

        const tempFeatures = [];

        // Cantrip
        tempFeatures.push({
            name: `${ElfHigh.name}-cantrip`,
            title: "Cantrip",
            html: `
                <p><b>Cantrip.</b> You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.</p>
                `,
            source: {
                name: "sub-race",
                title: ElfHigh.title
            },
            displayType: "feature-card"
        });

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "subRace";
            feature.sourcePropertyValue = ElfHigh.name
            features.push(feature);
        }
    }

    static applySpells(spells, character) {

        const tempSpells = [];

        let cantrip = null;
        const cantrips = character.selections.find(s => s.name == `${ElfHigh.name}-cantrip`)?.values ?? [];
        if (cantrips.length > 0) {
            cantrip = cantrips[0].value;
        }
        if (cantrip) {
            tempSpells.push(cantrip);
        }

        for (const spell of tempSpells) {
            spells.push(spell);
        }
    }

}
