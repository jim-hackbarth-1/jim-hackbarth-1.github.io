
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class FalseLife {

    static get name() { return "false-life"; }
    static get title() { return "False Life"; }
    static get level() { return 1; }
    static get school() { return "necromancy"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self"; }
    static get components() { return "V, S, M (a small amount of alcohol or distilled spirits)"; }
    static get duration() { return "1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(FalseLife, FalseLife.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(FalseLife, FalseLife.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = FalseLife.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Bolstering yourself with a necromantic facsimile of life, you gain 1d4 + 4 temporary hit points for the duration.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you gain 5 additional temporary hit points for each slot level above 1st.
        </p>
    `;

}
