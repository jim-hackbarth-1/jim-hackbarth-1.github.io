
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ComprehendLanguages {

    static get name() { return "comprehend-languages"; }
    static get title() { return "Comprehend Languages"; }
    static get level() { return 1; }
    static get school() { return "divination"; }
    static get isRitual() { return true; }
    static get classes() { return ["bard", "sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self"; }
    static get components() { return "V, S, M (a pinch of soot and salt)"; }
    static get duration() { return "1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(ComprehendLanguages, ComprehendLanguages.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(ComprehendLanguages, ComprehendLanguages.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ComprehendLanguages.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            For the duration, you understand the literal meaning of any spoken language that you hear. You also understand any written language that you see, but you must be touching the surface on which the words are written. It takes about 1 minute to read one page of text.
        </p>
        <p>
            This spell doesn’t decode secret messages in a text or glyph, such as an arcane sigil, that isn’t part of a written language.
        </p>
    `;

}
