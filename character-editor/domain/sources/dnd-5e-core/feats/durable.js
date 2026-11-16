
import { DnD5ESource } from "../dnd-5e-core-source.js"

export class Durable {

    static get name() { return "durable"; }
    static get title() { return "Durable"; }
    static get canBeTakenMultipleTimes() { return false; }
    static get html() { return DnD5ESource.getFeatHtml(Durable, Durable.#content); }

    static checkPrerequisites(character) {
        return { prerequisitesMet: true, text: null };
    }

    static getSelections(character, classIndex, level) {
        return [];
    }

    static getSelectionOptions(character, classIndex, level, selectionName, sources) {
        return [];
    }

    static applyModifiers(character, classIndex, level, targetFilters) {
        const modifiers = [];
        modifiers.push(
        {
            name: `${Durable.name}-constitution-modifier`,
            target: `ability-score:constitution`,
            value: 1,
            title: Durable.title,
        });
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
                modifier.sourcePropertyValue = Durable.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, classIndex, level) {
        const tempFeatures = [];
        tempFeatures.push(character.getFeatureCard(Durable.name, Durable.title, Durable.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
            feature.sourcePropertyValue = Durable.name;
            feature.cardSource = `${Durable.title} (Feat)`;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex, level) {

    }

    static #content = `
        <p>
            Hardy and resilient, you gain the following benefits:
            <ul>
                <li>Increase your Constitution score by 1, to a maximum of 20.</li>
                <li>When you roll a Hit Die to regain hit points, the minimum number of hit points you regain from the roll equals twice your Constitution modifier (minimum of 2).</li>
            </ul>
        </p>
    `;

}
