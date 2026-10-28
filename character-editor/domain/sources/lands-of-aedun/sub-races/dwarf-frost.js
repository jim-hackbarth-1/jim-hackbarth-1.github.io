
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

    static getSelectionOptions(character, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, targetFilters) {
        const modifiers = [];
        modifiers.push({
            name: "frost-dwarf-ability-score-modifier-strength",
            title: "Ability score",
            value: 1,
            target: "ability-score:strength"
        });
        modifiers.push({
            name: "frost-dwarf-skill-bonus-medicine",
            title: "Skill modifier",
            value: 5,
            target: "skill:medicine"
        });
        modifiers.push({
            name: "frost-dwarf-skill-bonus-survival",
            title: "Skill modifier",
            value: 5,
            target: "skill:survival"
        });
        modifiers.push({
            name: "frost-dwarf-languages-common",
            title: "Language",
            value: { value: "common", text: "Common" },
            target: "language"
        });
        modifiers.push({
            name: "frost-dwarf-languages-dwarvish",
            title: "Language",
            value: { value: "ruic", text: "Ruic" },
            target: "language"
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
