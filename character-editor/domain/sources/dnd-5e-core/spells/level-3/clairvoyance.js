
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Clairvoyance {

    static get name() { return "clairvoyance"; }
    static get title() { return "Clairvoyance"; }
    static get level() { return 3; }
    static get school() { return "divination"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "cleric", "sorcerer", "wizard"]; }
    static get castingTime() { return "10 minutes"; }
    static get range() { return "1 mile"; }
    static get components() { return "V, S, M (a focus worth at least 100 gp, either a jeweled horn for hearing or a glass eye for seeing)"; }
    static get duration() { return "Concentration, up to 10 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(Clairvoyance, Clairvoyance.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Clairvoyance, Clairvoyance.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Clairvoyance.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You create an invisible sensor within range in a location familiar to you (a place you have visited or seen before) or in an obvious location that is unfamiliar to you (such as behind a door, around a corner, or in a grove of trees). The sensor remains in place for the duration, and it can’t be attacked or otherwise interacted with.
        </p>
        <p>
            When you cast the spell, you choose seeing or hearing. You can use the chosen sense through the sensor as if you were in its space. As your action, you can switch between seeing and hearing. A creature that can see the sensor (such as a creature benefitting from see invisibility or truesight) sees a luminous, intangible orb about the size of your fist.
        </p>
    `;

}
