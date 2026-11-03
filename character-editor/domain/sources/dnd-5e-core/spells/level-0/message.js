
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Message {

    static get name() { return "message"; }
    static get title() { return "Message"; }
    static get level() { return 0; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "120 feet"; }
    static get components() { return "V, S, M (a short piece of copper wire)"; }
    static get duration() { return "1 round"; }
    static get html() { return DnD5ESource.getSpellHtml(Message, Message.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Message, Message.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Message.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You point your finger toward a creature within range and whisper a message. The target (and only the target) hears the message and can reply in a whisper that only you can hear.
        </p>
        <p>
            You can cast this spell through solid objects if you are familiar with the target and know it is beyond the barrier. Magical silence, 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood blocks the spell. The spell doesn’t have to follow a straight line and can travel freely around corners or through openings.
        </p>
    `;

}
