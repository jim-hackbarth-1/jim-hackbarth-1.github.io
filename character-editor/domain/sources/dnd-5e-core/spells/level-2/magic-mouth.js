
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class MagicMouth {

    static get name() { return "magic-mouth"; }
    static get title() { return "Magic Mouth"; }
    static get level() { return 2; }
    static get school() { return "illusion"; }
    static get isRitual() { return true; }
    static get classes() { return ["bard", "wizard"]; }
    static get castingTime() { return "1 minute"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S, M (a small bit of honeycomb and jade dust worth at least 10 gp, which the spell consumes)"; }
    static get duration() { return "Until dispelled"; }
    static get html() { return DnD5ESource.getSpellHtml(MagicMouth, MagicMouth.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(MagicMouth, MagicMouth.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = MagicMouth.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You implant a message within an object in range, a message that is uttered when a trigger condition is met. Choose an object that you can see and that isn’t being worn or carried by another creature. Then speak the message, which must be 25 words or less, though it can be delivered over as long as 10 minutes. Finally, determine the circumstance that will trigger the spell to deliver your message.
        </p>
        <p>
            When that circumstance occurs, a magical mouth appears on the object and recites the message in your voice and at the same volume you spoke. If the object you chose has a mouth or something that looks like a mouth (for example, the mouth of a statue), the magical mouth appears there so that words appear to come from the object’s mouth. When you cast this spell, you can have the spell end after it delivers its message, or it can remain and repeats its message whenever the trigger occurs.
        </p>
        <p>
            The triggering circumstance can be as general or as detailed as you like, though it must be based on visual or audible conditions that occur within 30 feet of the object. For example, you could instruct the mouth to speak when any creature moves within 30 feet of the object or when a silver bell rings within 30 feet of it.
        </p>
    `;

}
