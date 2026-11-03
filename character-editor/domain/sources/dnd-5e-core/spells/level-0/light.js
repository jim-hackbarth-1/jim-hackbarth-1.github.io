
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Light {

    static get name() { return "light"; }
    static get title() { return "Light"; }
    static get level() { return 0; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "cleric", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, M (a firefly or phosphorescent moss)"; }
    static get duration() { return "1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(Light, Light.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Light, Light.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Light.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You touch one object that is no larger than 10 feet in any dimension. Until the spell ends, the object sheds bright light in a 20-foot radius and dim light for an additional 20 feet. The light can be colored as you like. Completely covering the object with something opaque blocks the light. The spell ends if you cast it again or dismiss it as an action.
        </p>
        <p>
            If you target an object held or worn by a hostile creature, that creature must succeed on a Dexterity saving throw to avoid the spell.
        </p>
    `;

}
