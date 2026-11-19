
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Sending {

    static get name() { return "sending"; }
    static get title() { return "Sending"; }
    static get level() { return 3; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "cleric", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Unlimited"; }
    static get components() { return "V, S, M (a short piece of fine copper wire)"; }
    static get duration() { return "1 round"; }
    static get html() { return DnD5ESource.getSpellHtml(Sending, Sending.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Sending, Sending.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Sending.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You send a short message of twenty-five words or less to a creature with which you are familiar. The creature hears the message in its mind, recognizes you as the sender if it knows you, and can answer in a like manner immediately. The spell enables creatures with Intelligence scores of at least 1 to understand the meaning of your message.
        </p>
        <p>
            You can send the message across any distance and even to other planes of existence, but if the target is on a different plane than you, there is a 5 percent chance that the message doesn't arrive.
        </p>
    `;

}
