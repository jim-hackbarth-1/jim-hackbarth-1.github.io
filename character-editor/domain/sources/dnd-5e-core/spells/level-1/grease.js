
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Grease {

    static get name() { return "grease"; }
    static get title() { return "Grease"; }
    static get level() { return 1; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, S, M (a bit of pork rind or butter)"; }
    static get duration() { return "1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(Grease, Grease.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Grease, Grease.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Grease.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Slick grease covers the ground in a 10-foot square centered on a point within range and turns it into difficult terrain for the duration.
        </p>
        <p>
            When the grease appears, each creature standing in its area must succeed on a Dexterity saving throw or fall prone. A creature that enters the area or ends its turn there must also succeed on a Dexterity saving throw or fall prone.
        </p>
    `;

}
