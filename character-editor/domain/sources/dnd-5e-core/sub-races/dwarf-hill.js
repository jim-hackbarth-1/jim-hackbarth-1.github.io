
export class DwarfHill {

    static get name() {
        return "dwarf-hill";
    }

    static get title() {
        return "Hill Dwarf";
    }

    static get htmlPath() {
        return "dnd-5e-core/sub-races/dwarf-hill.html";
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
            name: "hill-dwarf-ability-score-modifier-wisdom",
            title: "Ability score",
            value: 1,
            target: "ability-score:wisdom"
        });
        const hitPointMod = Number(character.level);
        modifiers.push({
            name: "hill-dwarf-toughness",
            title: "Hill dwarf toughness",
            value: hitPointMod,
            target: "hit-points"
        });

        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = "sub-race";
                modifier.sourcePropertyValue = DwarfHill.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character) {

    }

    static applySpells(spells, character) {

    }

}
