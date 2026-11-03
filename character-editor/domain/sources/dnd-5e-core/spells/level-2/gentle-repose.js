
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class GentleRepose {

    static get name() { return "gentle-repose"; }
    static get title() { return "Gentle Repose"; }
    static get level() { return 2; }
    static get school() { return "necromancy"; }
    static get isRitual() { return true; }
    static get classes() { return ["cleric", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (a pinch of salt and one copper piece placed on each of the corpse’s eyes, which must remain there for the duration)"; }
    static get duration() { return "10 days"; }
    static get html() { return DnD5ESource.getSpellHtml(GentleRepose, GentleRepose.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(GentleRepose, GentleRepose.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = GentleRepose.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You touch a corpse or other remains. For the duration, the target is protected from decay and can’t become undead.
        </p>
        <p>
            The spell also effectively extends the time limit on raising the target from the dead, since days spent under the influence of this spell don’t count against the time limit of spells such as raise dead.
        </p>
    `;

}
