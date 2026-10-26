
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
        const selections = [];
        selections.push(character.selectionUtilities.getSelection(
            character.selections, `${Dwarf.name}-tool-proficiency`, "Tool Proficiency", 1));
        return selections;
    }

    static getSelectionOptions(character, selectionName, sources) {
        let options = [];
        if (selectionName == `${Dwarf.name}-tool-proficiency`) {
            const proficiencies = [...Dwarf.#toolProficiencies];
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.selectionUtilities.getSelectionOptions(
                proficiencies, selectedValues, [], "Tool proficiency (choose 1) ...");
        }
        return options;
    }

    static applyModifiers(character, targetFilters) {
        const modifiers = [];

        // constitution
        modifiers.push({
            name: "dwarven-ability-score-modifier-constitution",
            title: "Ability score",
            value: 2,
            target: "ability-score:constitution"
        });

        // speed
        let maxStrengthReq = 0;
        const armorItems = character.equipment.filter(e => e.isEquipped && e.properties && e.properties.some(p => p.name == "strength"));
        for (const armor of armorItems) {
            const strengthReq = Number(armor.properties.find(p => p.name == "strength").value);
            if (strengthReq > maxStrengthReq) {
                maxStrengthReq = strengthReq;
            }
        }
        const strength = character.getAbilityScore("strength");
        if (strength < maxStrengthReq) {
            modifiers.push({
                name: "dwarven-heavy-armor-speed",
                title: "Speed",
                value: 10,
                target: "speed"
            });
        }

        // weapon proficiencies
        modifiers.push({
            name: "dwarven-weapon-proficiency-battleaxe",
            title: "Weapon proficiency",
            value: "battleaxe",
            target: "weapon-proficiency"
        });
        modifiers.push({
            name: "dwarven-weapon-proficiency-handaxe",
            title: "Weapon proficiency",
            value: "handaxe",
            target: "weapon-proficiency"
        });
        modifiers.push({
            name: "dwarven-weapon-proficiency-light-hammer",
            title: "Weapon proficiency",
            value: "light-hammer",
            target: "weapon-proficiency"
        });
        modifiers.push({
            name: "dwarven-weapon-proficiency-warhammer",
            title: "Weapon proficiency",
            value: "warhammer",
            target: "weapon-proficiency"
        });

        // tool proficiency
        let toolProficiency = null;
        const toolProficiencies = character.selections.find(o => o.name == `${Dwarf.name}-tool-proficiency`)?.values ?? [];
        if (toolProficiencies.length > 0) {
            toolProficiency = toolProficiencies[0];
        }
        if (toolProficiency) {
            modifiers.push({
                name: "dwarven-tool-proficiency",
                title: "Tool proficiency",
                value: toolProficiency.value,
                target: "tool-proficiency"
            });
        }

        // languages
        modifiers.push({
            name: "dwarven-languages-common",
            title: "Language",
            value: { value: "common", text: "Common" },
            target: "language"
        });
        modifiers.push({
            name: "dwarven-languages-dwarvish",
            title: "Language",
            value: { value: "dwarvish", text: "Dwarvish" },
            target: "language"
        });

        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = "race";
                modifier.sourcePropertyValue = Dwarf.name;
                character.addModifier(modifier);
            }
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
        { name: "smiths-tools", title: "Smith's tools" },
        { name: "brewers-tools", title: "Brewer's tools" },
        { name: "masons-tools", title: "Mason's tools" }
    ];

}
