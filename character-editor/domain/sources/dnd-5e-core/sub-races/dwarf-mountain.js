
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

    static getSelectionOptions(character, optionName, sources) {
        return [];
    }

    static applyModifiers(character, targetFilters) {
        const modifiers = [];

        modifiers.push({
            name: "mountain-dwarf-ability-score-modifier-strength",
            target: "ability-score:strength",
            value: 2,
            title: DwarfMountain.title
        });
        modifiers.push({
            name: "mountain-dwarf-armor-profiency-light-armor",
            target: "armor-proficiency",
            value: "light-armor",
            title: DwarfMountain.title
        });
        modifiers.push({
            name: "mountain-dwarf-armor-profiency-medium-armor",
            target: "armor-proficiency",
            value: "medium-armor",
            title: DwarfMountain.title
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
