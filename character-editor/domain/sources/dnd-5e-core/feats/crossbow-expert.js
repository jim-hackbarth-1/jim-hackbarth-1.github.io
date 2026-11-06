
import { DnD5ESource } from "../dnd-5e-core-source.js"

export class CrossbowExpert {

    static get name() { return "crossbow-expert"; }
    static get title() { return "Crossbow Expert"; }
    static get canBeTakenMultipleTimes() { return false; }
    static get html() { return DnD5ESource.getFeatHtml(CrossbowExpert, CrossbowExpert.#content); }

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

    }

    static applyFeatures(features, character, classIndex, level) {
        const tempFeatures = [];
        tempFeatures.push(character.getFeatureCard(CrossbowExpert.name, CrossbowExpert.title, CrossbowExpert.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = `class-${classIndex}-level-${level}-feat`;
            feature.sourcePropertyValue = CrossbowExpert.name;
            feature.cardSource = `${CrossbowExpert.title} (Feat)`;
            features.push(feature);
        }
    }

    static applySpells(spells, character, classIndex, level) {

    }

    static #content = `
        <p>
            Thanks to extensive practice with the crossbow, you gain the following benefits:
            <ul>
                <li>You ignore the loading quality of crossbows with which you are proficient.</li>
                <li>Being within 5 feet of a hostile creature doesn’t impose disadvantage on your ranged attack rolls.</li>
                <li>When you use the Attack action and attack with a one handed weapon, you can use a bonus action to attack with a hand crossbow you are holding.</li>
            </ul>
        </p>
    `;

}
