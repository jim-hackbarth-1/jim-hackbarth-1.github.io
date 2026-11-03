
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Mending {

    static get name() { return "mending"; }
    static get title() { return "Mending"; }
    static get level() { return 0; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "cleric", "druid", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 minute"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (two lodestones)"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(Mending, Mending.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Mending, Mending.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Mending.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            This spell repairs a single break or tear in an object you touch, such as a broken chain link, two halves of a broken key, a torn cloak, or a leaking wineskin. As long as the break or tear is no larger than 1 foot in any dimension, you mend it, leaving no trace of the former damage.
        </p>
        <p>
            This spell can physically repair a magic item or construct, but the spell can’t restore magic to such an object.
        </p>
    `;

}
