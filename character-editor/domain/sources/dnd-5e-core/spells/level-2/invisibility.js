
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Invisibility {

    static get name() { return "invisibility"; }
    static get title() { return "Invisibility"; }
    static get level() { return 2; }
    static get school() { return "illusion"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (an eyelash encased in gum arabic)"; }
    static get duration() { return "Concentration, up to 1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(Aid, Aid.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Invisibility, Invisibility.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Invisibility.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target’s person. The spell ends for a target that attacks or casts a spell.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd.
        </p>
    `;

}
