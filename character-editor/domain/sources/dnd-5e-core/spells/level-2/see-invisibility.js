
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class SeeInvisibility {

    static get name() { return "see-invisibility"; }
    static get title() { return "See Invisibility"; }
    static get level() { return 2; }
    static get school() { return "divination"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self"; }
    static get components() { return "V, S, M (a pinch of talc and a small sprinkling of powdered silver)"; }
    static get duration() { return "1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(SeeInvisibility, SeeInvisibility.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(SeeInvisibility, SeeInvisibility.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = SeeInvisibility.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            For the duration, you see invisible creatures and objects as if they were visible, and you can see into the Ethereal Plane. Ethereal creatures and objects appear ghostly and translucent.
        </p>
    `;

}
