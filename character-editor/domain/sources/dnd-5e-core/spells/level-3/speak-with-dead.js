
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class SpeakWithDead {

    static get name() { return "speak-with-dead"; }
    static get title() { return "Speak with Dead"; }
    static get level() { return 3; }
    static get school() { return "necromancy"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "cleric"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "10 feet"; }
    static get components() { return "V, S, M (burning incense)"; }
    static get duration() { return "10 minutes"; }
    static get html() { return DnD5ESource.getSpellHtml(SpeakWithDead, SpeakWithDead.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(SpeakWithDead, SpeakWithDead.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = SpeakWithDead.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You grant the semblance of life and intelligence to a corpse of your choice within range, allowing it to answer the questions you pose. The corpse must still have a mouth and can’t be undead. The spell fails if the corpse was the target of this spell within the last 10 days.
        </p>
        <p>
            Until the spell ends, you can ask the corpse up to five questions. The corpse knows only what it knew in life, including the languages it knew. Answers are usually brief, cryptic, or repetitive, and the corpse is under no compulsion to offer a truthful answer if you are hostile to it or it recognizes you as an enemy. This spell doesn’t return the creature’s soul to its body, only its animating spirit. Thus, the corpse can’t learn new information, doesn’t comprehend anything that has happened since it died, and can’t speculate about future events.
        </p>
    `;

}
