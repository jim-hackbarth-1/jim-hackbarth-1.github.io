
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

    }

    static applyFeatures(features, character, classIndex, level) {

    }

    static applySpells(spells, character, classIndex, level) {

    }

    static #content = `
        <p>
            [Actor content here]
        </p>
    `;

}
