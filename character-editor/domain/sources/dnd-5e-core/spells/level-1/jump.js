
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Jump {

    static get name() { return "jump"; }
    static get title() { return "Jump"; }
    static get level() { return 1; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid", "ranger", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (a grasshopper’s hind leg)"; }
    static get duration() { return "1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(Jump, Jump.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Jump, Jump.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Jump.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You touch a creature. The creature’s jump distance is tripled until the spell ends.
        </p>
    `;

}
