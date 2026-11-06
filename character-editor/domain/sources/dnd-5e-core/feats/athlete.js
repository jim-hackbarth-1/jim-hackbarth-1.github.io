
import { DnD5ESource } from "../dnd-5e-core-source.js"

export class Athlete {

    static get name() { return "athlete"; }
    static get title() { return "Athlete"; }
    static get canBeTakenMultipleTimes() { return false; }
    static get html() { return DnD5ESource.getFeatHtml(Athlete, Athlete.#content); }

    static checkPrerequisites(character) {
        return { prerequisitesMet: true, text: null };
    }

    static getSelections(character, classIndex, level) {
        const selections = [];
        selections.push(character.getSelection(
            character.selections, `${Athlete.name}-ability-score-increase`, "Ability", 1));
        return selections;
    }

    static getSelectionOptions(character, classIndex, level, selectionName, sources) {
        let options = [];
        if (selectionName == "athlete-ability-score-increase") {
            const abilities = [
                { name: "strength", title: "Strength" },
                { name: "dexterity", title: "Dexterity" }
            ];
            const selectedValues = character.selections.find(s => s.name == selectionName)?.values ?? [];
            options = character.getSelectionOptions(
                abilities, selectedValues, [], "Ability (choose 1) ...");
        }
        return options;
    }

    static applyModifiers(character, classIndex, level, targetFilters) {
        const modifiers = [];
        let abilityScore = null;
        const values = character.selections.find(s => s.name == "athlete-ability-score-increase")?.values ?? [];
        if (values.length > 0) {
            abilityScore = values[0];
        }
        if (abilityScore) {
            modifiers.push(
                {
                    name: "athlete-ability-score-modifier",
                    target: `ability-score:${abilityScore.value}`,
                    value: 1,
                    title: Athlete.title,
                });
        }
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
                modifier.sourcePropertyValue = "athlete";
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, classIndex, level) {
        const tempFeatures = [];
        tempFeatures.push(character.getFeatureCard(Athlete.name, Athlete.title, Athlete.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
            feature.sourcePropertyValue = Athlete.name;
            feature.cardSource = `${Athlete.title} (Feat)`;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex, level) {

    }

    static #content = `
        <p>You have undergone extensive physical training to gain the following benefits:<p>
        <p>
            <ul>
                <li>Increase your Strength or Dexterity score by 1, to a maximum of 20.</li>
                <li>When you are prone, standing up uses only 5 feet of your movement.</li>
                <li>Climbing doesn't cost you extra movement.</li>
                <li>You can make a running long jump or a running high jump after moving only 5 feet on foot, rather than 10 feet.</li>
            </ul>
        </p>
    `;

}
