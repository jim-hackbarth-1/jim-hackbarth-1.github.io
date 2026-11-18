
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class GreaterInvisibility {

    static get name() { return "greater-invisibility"; }
    static get title() { return "Greater Invisibility"; }
    static get level() { return 4; }
    static get school() { return "illusion"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(GreaterInvisibility, GreaterInvisibility.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(GreaterInvisibility, GreaterInvisibility.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = GreaterInvisibility.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You or a creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target’s person.
        </p>
    `;

}
