
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Fly {

    static get name() { return "fly"; }
    static get title() { return "Fly"; }
    static get level() { return 3; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (a wing feather from any bird)"; }
    static get duration() { return "Concentration, up to 10 minutes"; }
    static get html() { return DnD5ESource.getSpellHtml(Fly, Fly.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Fly, Fly.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Fly.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You touch a willing creature. The target gains a flying speed of 60 feet for the duration. When the spell ends, the target falls if it is still aloft, unless it can stop the fall.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, you can target one additional creature for each slot level above 3rd.
        </p>
    `;

}
