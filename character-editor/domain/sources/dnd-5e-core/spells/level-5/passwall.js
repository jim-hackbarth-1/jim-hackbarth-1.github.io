
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Passwall {

    static get name() { return "passwall"; }
    static get title() { return "Passwall"; }
    static get level() { return 5; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["wizard"]; }
    static get castingTime() { return "1 hour"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S, M (a pinch of sesame seeds)"; }
    static get duration() { return "1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(Passwall, Passwall.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Passwall, Passwall.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Passwall.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A passage appears at a point of your choice that you can see on a wooden, plaster, or stone surface (such as a wall, a ceiling, or a floor) within range, and lasts for the duration. You choose the opening’s dimensions: up to 5 feet wide, 8 feet tall, and 20 feet deep. The passage creates no instability in a structure surrounding it.
        </p>
        <p>
            When the opening disappears, any creatures or objects still in the passage created by the spell are safely ejected to an unoccupied space nearest to the surface on which you cast the spell.
        </p>
    `;

}
