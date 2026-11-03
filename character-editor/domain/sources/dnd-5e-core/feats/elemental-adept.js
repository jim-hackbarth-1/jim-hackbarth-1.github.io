
import { DnD5ESource } from "../dnd-5e-core-source.js"

export class ElementalAdept {

    static get name() { return "elemental-adept"; }
    static get title() { return "Elemental Adept"; }
    static get canBeTakenMultipleTimes() { return true; }
    static get html() { return DnD5ESource.getFeatHtml(ElementalAdept, ElementalAdept.#content); }

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
