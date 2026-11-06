
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class IllusoryScript {

    static get name() { return "illusory-script"; }
    static get title() { return "Illusory Script"; }
    static get level() { return 1; }
    static get school() { return "illusion"; }
    static get isRitual() { return true; }
    static get classes() { return ["bard", "warlock", "wizard"]; }
    static get castingTime() { return "1 minute"; }
    static get range() { return "Touch"; }
    static get components() { return "S, M (a lead-based ink worth at least 10 gp, which the spell consumes)"; }
    static get duration() { return "10 days"; }
    static get html() { return DnD5ESource.getSpellHtml(IllusoryScript, IllusoryScript.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(IllusoryScript, IllusoryScript.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = IllusoryScript.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You write on parchment, paper, or some other suitable writing material and imbue it with a potent illusion that lasts for the duration.
        </p>
        <p>
            To you and any creatures you designate when you cast the spell, the writing appears normal, written in your hand, and conveys whatever meaning you intended when you wrote the text. To all others, the writing appears as if it were written in an unknown or magical script that is unintelligible. Alternatively, you can cause the writing to appear to be an entirely different message, written in a different hand and language, though the language must be one you know.
        </p>
        <p>
            Should the spell be dispelled, the original script and the illusion both disappear. A creature with truesight can read the hidden message.
        </p>
    `;

}
