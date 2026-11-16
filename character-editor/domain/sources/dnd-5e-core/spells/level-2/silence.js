
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Silence {

    static get name() { return "silence"; }
    static get title() { return "Silence"; }
    static get level() { return 2; }
    static get school() { return "illusion"; }
    static get isRitual() { return true; }
    static get classes() { return ["bard", "cleric", "ranger"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "120 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Concentration, up to 10 minutes"; }
    static get html() { return DnD5ESource.getSpellHtml(Silence, Silence.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Silence, Silence.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Silence.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            For the duration, no sound can be created within or pass through a 20-foot-radius sphere centered on a point you choose within range. Any creature or object entirely inside the sphere is immune to thunder damage, and creatures are deafened while entirely inside it. Casting a spell that includes a verbal component is impossible there.
        </p>
    `;

}
