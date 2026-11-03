
import { DnD5ESource } from "../dnd-5e-core-source.js"

export class Healer {

    static get name() { return "healer"; }
    static get title() { return "Healer"; }
    static get canBeTakenMultipleTimes() { return false; }
    static get html() { return DnD5ESource.getFeatHtml(Healer, Healer.#content); }

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
