
import { DnD5ESource } from "../dnd-5e-core-source.js"

export class Linguist {

    static get name() { return "linguist"; }
    static get title() { return "Linguist"; }
    static get canBeTakenMultipleTimes() { return false; }
    static get html() { return DnD5ESource.getFeatHtml(Linguist, Linguist.#content); }

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

    }

    static applySpells(spells, character, classIndex, level) {

    }

    static #content = `
        <p>
            [Feat content here]
        </p>
    `;

}
