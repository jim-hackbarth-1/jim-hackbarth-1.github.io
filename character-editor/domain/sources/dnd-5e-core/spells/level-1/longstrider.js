
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Longstrider {

    static get name() { return "longstrider"; }
    static get title() { return "Longstrider"; }
    static get level() { return 1; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "druid", "ranger", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (a pinch of dirt)"; }
    static get duration() { return "1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(Longstrider, Longstrider.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Longstrider, Longstrider.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Longstrider.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You touch a creature. The target’s speed increases by 10 feet until the spell ends.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.
        </p>
    `;

}
