
export class DwarfMountain {

    static get name() {
        return "dwarf-mountain";
    }

    static get title() {
        return "Mountain Dwarf";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-races/dwarf-mountain.html";
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
            name: "mountain-dwarf-ability-score-modifier-strength",
            title: "Ability score",
            value: 2,
            target: "ability-score:strength"
        });
        modifiers.push({
            name: "mountain-dwarf-armor-profiency-light-armor",
            title: "Armor proficiency",
            value: "light-armor",
            target: "armor-proficiency"
        });
        modifiers.push({
            name: "mountain-dwarf-armor-profiency-medium-armor",
            title: "Armor proficiency",
            value: "medium-armor",
            target: "armor-proficiency"
        });

        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = "sub-race";
                modifier.sourcePropertyValue = DwarfMountain.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character) {

    }

    static applySpells(spells, character) {

    }

}
