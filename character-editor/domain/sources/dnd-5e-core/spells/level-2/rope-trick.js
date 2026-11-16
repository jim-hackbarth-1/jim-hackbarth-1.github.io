
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class RopeTrick {

    static get name() { return "rope-trick"; }
    static get title() { return "Rope Trick"; }
    static get level() { return 2; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (powdered corn extract and a twisted loop of parchment)"; }
    static get duration() { return "1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(RopeTrick, RopeTrick.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(RopeTrick, RopeTrick.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = RopeTrick.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You touch a length of rope that is up to 60 feet long. One end of the rope then rises into the air until the whole rope hangs perpendicular to the ground. At the upper end of the rope, an invisible entrance opens to an extradimensional space that lasts until the spell ends.
        </p>
        <p>
            The extradimensional space can be reached by climbing to the top of the rope. The space can hold as many as eight Medium or smaller creatures. The rope can be pulled into the space, making the rope disappear from view outside the space.
        </p>
        <p>
            Attacks and spells can’t cross through the entrance into or out of the extradimensional space, but those inside can see out of it as if through a 3-foot-by-5-foot window centered on the rope.
        </p>
        <p>
            Anything inside the extradimensional space drops out when the spell ends.
        </p>
    `;

}
