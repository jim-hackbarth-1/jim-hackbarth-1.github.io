
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class MinorIllusion {

    static get name() { return "minor-illusion"; }
    static get title() { return "Minor Illusion"; }
    static get level() { return 0; }
    static get school() { return "illusion"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "S, M (a bit of fleece)"; }
    static get duration() { return "1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(MinorIllusion, MinorIllusion.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(MinorIllusion, MinorIllusion.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = MinorIllusion.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You create a sound or an image of an object within range that lasts for the duration. The illusion also ends if you dismiss it as an action or cast this spell again.
        </p>
        <p>
            If you create a sound, its volume can range from a whisper to a scream. It can be your voice, someone else’s voice, a lion’s roar, a beating of drums, or any other sound you choose. The sound continues unabated throughout the duration, or you can make discrete sounds at different times before the spell ends.
        </p>
        <p>
            If you create an image of an object—such as a chair, muddy footprints, or a small chest—it must be no larger than a 5-foot cube. The image can’t create sound, light, smell, or any other sensory effect. Physical interaction with the image reveals it to be an illusion, because things can pass through it.
        </p>
        <p>
            If a creature uses its action to examine the sound or image, the creature can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the illusion becomes faint to the creature.
        </p>
    `;

}
