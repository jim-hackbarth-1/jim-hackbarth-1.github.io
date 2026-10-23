
export class DwarfFrost {

    static get name() {
        return "dwarf-frost";
    }

    static get title() {
        return "Frost Dwarf";
    }

    static get htmlPath() {
        return "lands-of-aedun/sub-races/dwarf-frost.html";
    }

    static get race() {
        return "dwarf";
    }

    static getSelections(character) {
        return [];
    }

    static getSelectionOptions(character, optionName, sources) {
        return [];
    }

    static applyModifiers(character, targetFilters) {
        const modifiers = [];
        modifiers.push({
            name: "frost-dwarf-ability-score-modifier-strength",
            target: "ability-score:strength",
            value: 1,
            title: DwarfFrost.title
        });
        modifiers.push({
            name: "frost-dwarf-skill-bonus-medicine",
            target: "skill:medicine",
            value: 5,
            title: DwarfFrost.title
        });
        modifiers.push({
            name: "frost-dwarf-skill-bonus-survival",
            target: "skill:survival",
            value: 5,
            title: DwarfFrost.title
        });
        modifiers.push({
            name: "frost-dwarf-languages-common",
            target: "language",
            value: { value: "common", text: "Common" },
            title: DwarfFrost.title
        });
        modifiers.push({
            name: "frost-dwarf-languages-dwarvish",
            target: "language",
            value: { value: "ruic", text: "Ruic" },
            title: DwarfFrost.title
        });

        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = "sub-race";
                modifier.sourcePropertyValue = DwarfFrost.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character) {

    }

    static applySpells(spells, character) {

    }

}
