
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Aid {

    static get name() { return "aid"; }
    static get title() { return "Aid"; }
    static get level() { return 2; }
    static get school() { return "abjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric", "paladin"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S, M (a tiny strip of white cloth)"; }
    static get duration() { return "8 hours"; }
    static get html() { return DnD5ESource.getSpellHtml(Aid, Aid.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Aid, Aid.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Aid.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Your spell bolsters your allies with toughness and resolve. Choose up to three creatures within range. Each target’s hit point maximum and current hit points increase by 5 for the duration.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, a target’s hit points increase by an additional 5 for each slot level above 2nd.
        </p>
    `;

}
