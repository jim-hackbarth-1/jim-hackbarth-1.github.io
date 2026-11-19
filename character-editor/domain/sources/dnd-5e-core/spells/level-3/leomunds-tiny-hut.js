
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class LeomundsTinyHut {

    static get name() { return "leomunds-tiny-hut"; }
    static get title() { return "Leomunds Tiny Hut"; }
    static get level() { return 3; }
    static get school() { return "evocation"; }
    static get isRitual() { return true; }
    static get classes() { return ["bard", "wizard"]; }
    static get castingTime() { return "1 minute"; }
    static get range() { return "Self (10-foot-radius hemisphere)"; }
    static get components() { return "V, S, M (a small crystal bead)"; }
    static get duration() { return "8 hours"; }
    static get html() { return DnD5ESource.getSpellHtml(LeomundsTinyHut, LeomundsTinyHut.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(LeomundsTinyHut, LeomundsTinyHut.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = LeomundsTinyHut.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A 10-foot-radius immobile dome of force springs into existence around and above you and remains stationary for the duration. The spell ends if you leave its area.
        </p>
        <p>
            Nine creatures of Medium size or smaller can fit inside the dome with you. The spell fails if its area includes a larger creature or more than nine creatures. Creatures and objects within the dome when you cast this spell can move through it freely. All other creatures and objects are barred from passing through it. Spells and other magical effects can't extend through the dome or be cast through it. The atmosphere inside the space is comfortable and dry, regardless of the weather outside.
        </p>
        <p>
            Until the spell ends, you can command the interior to become dimly lit or dark. The dome is opaque from the outside, of any color you choose, but it is transparent from the inside.
        </p>
    `;

}
