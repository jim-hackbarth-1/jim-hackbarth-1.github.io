
export class Dwarf {

    static get name() {
        return "dwarf";
    }

    static get title() {
        return "Dwarf";
    }

    static get htmlPath() {
        return "dnd-5e-core/races/dwarf.html";
    }

    static get speed() {
        return 25;
    }

    static get size() {
        return "medium";
    }

    static getSelections(character) {
        const selectionName = "dwarven-tool-proficiency";
        const currentSelections = character.selections.find(s => s.name == selectionName)?.values ?? [];
        if (currentSelections.length == 0) {
            currentSelections.push({ value: null, text: "Choose a tool proficiency ..." });
        }
        return [
            {
                name: selectionName,
                title: "Tool Proficiency",
                maxSelections: 1,
                currentSelections: currentSelections
            }
        ];
    }

    static getSelectionOptions(character, selectionName, sources) {
        let options = [];
        if (selectionName == "dwarven-tool-proficiency") {
            options = [...Dwarf.#toolProficiencies];
            options.unshift({ value: null, text: "Choose a tool proficiency ..." });
            let proficiency = null;
            const currentSelections = character.selections.find(s => s.name == selectionName)?.values ?? [];
            if (currentSelections.length > 0) {
                proficiency = currentSelections[0].value;
            }
            for (const option of options) {
                option.isSelected = (option.value == proficiency);
            }
        }
        return options;
    }

    static applyAbilityScoreModifiers(character) {
        const modifiers = [];
        modifiers.push({
            name: "dwarven-ability-score-modifier-constitution",
            target: "ability-score:constitution",
            value: 2,
            title: Dwarf.title
        });
        for (const modifier of modifiers) {
            modifier.sourcePropertyName = "race";
            modifier.sourcePropertyValue = Dwarf.name;
            character.addModifier(modifier);
        }
    }

    static applyModifiers(character) {
        const modifiers = [];

        // speed
        let maxStrengthReq = 0;
        const armorItems = character.equipment.filter(e => e.isEquipped && e.properties && e.properties.some(p => p.name == "strength"));
        for (const armor of armorItems) {
            const strengthReq = Number(armor.properties.find(p => p.name == "strength").map(p => p.value));
            if (strengthReq > maxStrengthReq) {
                maxStrengthReq = strengthReq;
            }
        }
        const strength = character.getAbilityScore("strength");
        if (strength < maxStrengthReq) {
            modifiers.push({
                name: "dwarven-heavy-armor-speed",
                target: "speed",
                value: 10,
                title: Dwarf.title
            });
        }

        // weapon proficiencies
        modifiers.push({
            name: "dwarven-weapon-profiency-battleaxe",
            target: "weapon-proficiency",
            value: "battleaxe",
            title: Dwarf.title
        });
        modifiers.push({
            name: "dwarven-weapon-profiency-handaxe",
            target: "weapon-proficiency",
            value: "handaxe",
            title: Dwarf.title
        });
        modifiers.push({
            name: "dwarven-weapon-profiency-light-hammer",
            target: "weapon-proficiency",
            value: "light-hammer",
            title: Dwarf.title
        });
        modifiers.push({
            name: "dwarven-weapon-profiency-warhammer",
            target: "weapon-proficiency",
            value: "warhammer",
            title: Dwarf.title
        });

        // tool proficiency
        let toolProfiency = null;
        const toolProficiencies = character.selections.find(o => o.name == "dwarven-tool-proficiency")?.values ?? [];
        if (toolProficiencies.length > 0) {
            toolProfiency = toolProficiencies[0];
        }
        if (toolProfiency) {
            modifiers.push({
                name: "dwarven-tool-profiency",
                target: "tool-proficiency",
                value: toolProfiency.value,
                title: Dwarf.title
            });
        }

        // languages
        modifiers.push({
            name: "dwarven-languages-common",
            target: "language",
            value: { name: "common", text: "Common" },
            title: Dwarf.title
        });
        modifiers.push({
            name: "dwarven-languages-dwarvish",
            target: "language",
            value: { name: "dwarvish", text: "Dwarvish" },
            title: Dwarf.title
        });

        for (const modifier of modifiers) {
            modifier.sourcePropertyName = "race";
            modifier.sourcePropertyValue = Dwarf.name;
            character.addModifier(modifier);
        }
    }

    static applyFeatures(features, character) {
        const tempFeatures = [];

        // darkvision
        tempFeatures.push({
            name: "dwarven-darkvision",
            title: "Darkvision",
            html: `
                <p><b>Darkvision.</b> Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.</p>
                `,
            source: {
                name: "race",
                title: Dwarf.title
            },
            displayType: "feature-card"
        });

        // dwarven resilience
        tempFeatures.push({
            name: "dwarven-resilience",
            title: "Dwarven Resilience",
            html: `
                <p><b>Stonecunning.</b> Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check, instead of your normal proficiency bonus.</p>
                `,
            source: {
                name: "race",
                title: Dwarf.title
            },
            displayType: "feature-card"
        });

        // stonecunning
        tempFeatures.push({
            name: "dwarven-stonecunning",
            title: "Stonecunning",
            html: `
                <p><b>Dwarven Resilience.</b> You have advantage on saving throws against poison, and you have resistance against poison damage.</p>
                `,
            source: {
                name: "race",
                title: Dwarf.title
            },
            displayType: "feature-card"
        });

        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "race";
            feature.sourcePropertyValue = Dwarf.name
            features.push(feature);
        }
    }

    static applySpells(spells, character) {
    }

    static #toolProficiencies = [
        { value: "smiths-tools", text: "Smith's tools" },
        { value: "brewers-supplies", text: "Brewer's supplies" },
        { value: "masons-tools", text: "Mason's tools" }
    ];

}
