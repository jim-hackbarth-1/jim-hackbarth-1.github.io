
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ArcaneLock {

    static get name() { return "arcane-lock"; }
    static get title() { return "Arcane Lock"; }
    static get level() { return 2; }
    static get school() { return "abjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (gold dust worth at least 25 gp, which the spell consumes)"; }
    static get duration() { return "Until dispelled"; }
    static get html() { return DnD5ESource.getSpellHtml(ArcaneLock, ArcaneLock.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(ArcaneLock, ArcaneLock.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ArcaneLock.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You touch a closed door, window, gate, chest, or other entryway, and it becomes locked for the duration.
        </p>
        <p>
            You and the creatures you designate when you cast this spell can open the object normally. You can also set a password that, when spoken within 5 feet of the object, suppresses this spell for 1 minute. Otherwise, it is impassable until it is broken or the spell is dispelled or suppressed. Casting Knock on the object suppresses Arcane Lock for 10 minutes.
        </p>
        <p>
            While affected by this spell, the object is more difficult to break or force open; the DC to break it or pick any locks on it increases by 10.
        </p>
    `;

}
