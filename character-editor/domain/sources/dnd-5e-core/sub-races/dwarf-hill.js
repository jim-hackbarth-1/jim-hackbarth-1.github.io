
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

    static getSelectionOptions(character, optionName, sources) {
        return [];
    }

    static applyAbilityScoreModifiers(character) {
        const modifiers = [];
        modifiers.push({
            name: "hill-dwarf-ability-score-modifier-wisdom",
            target: "ability-score:wisdom",
            value: 1,
            title: DwarfHill.title
        });
        for (const modifier of modifiers) {
            modifier.sourcePropertyName = "sub-race";
            modifier.sourcePropertyValue = DwarfHill.name;
            character.addModifier(modifier);
        }
    }

    static applyModifiers(character) {
        const modifiers = [];

        const hitPointMod = Number(character.level);
        modifiers.push({
            name: "hill-dwarf-toughness",
            target: "hit-points",
            value: hitPointMod,
            title: DwarfHill.title
        });

        for (const modifier of modifiers) {
            modifier.sourcePropertyName = "sub-race";
            modifier.sourcePropertyValue = DwarfHill.name;
            character.addModifier(modifier);
        }
    }

    static applyFeatures(features, character) {

    }

    static applySpells(spells, character) {

    }

}
