
import { DnD5ESource } from "../dnd-5e-core-source.js"

export class Actor {

    static get name() { return "actor"; }
    static get title() { return "Actor"; }
    static get canBeTakenMultipleTimes() { return false; }
    static get html() { return DnD5ESource.getFeatHtml(Actor, Actor.#content); }

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
            name: `${Actor.name}-ability-score-modifier-charisma`,
            target: "ability-score:charisma",
            value: 1,
            title: Actor.title,
        });
        for (const modifier of modifiers) {
            if (targetFilters.includeTarget(modifier.target)) {
                modifier.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
                modifier.sourcePropertyValue = Actor.name;
                character.addModifier(modifier);
            }
        }
    }

    static applyFeatures(features, character, classIndex, level) {
        const tempFeatures = [];
        tempFeatures.push(character.getFeatureCard(Actor.name, Actor.title, Actor.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
            feature.sourcePropertyValue = Actor.name
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex, level) {

    }

    static #content = `
        <p>
            Skilled at mimicry and dramatics, you gain the following benefits:
            <ul>
                <li>Increase your Charisma score by 1, to a maximum of 20.</li>
                <li>You have an advantage on Charisma (Deception) and Charisma (Performance) checks when trying to pass yourself off as a different person.</li>
                <li>You can mimic the speech of another person or the sounds made by other creatures. You must have heard the person speaking, or heard the creature make the sound, for at least 1 minute. A successful Wisdom (Insight) check contested by your Charisma (Deception) check allows a listener to determine that the effect is faked.</li>
            </ul>
        </p>
    `;

}
