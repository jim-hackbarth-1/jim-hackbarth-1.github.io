
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class StoneShape {

    static get name() { return "stone-shape"; }
    static get title() { return "Stone Shape"; }
    static get level() { return 4; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric", "druid", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (soft clay, which must be worked into roughly the desired shape of the stone object)"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(StoneShape, StoneShape.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(StoneShape, StoneShape.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = StoneShape.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You touch a stone object of Medium size or smaller or a section of stone no more than 5 feet in any dimension and form it into any shape that suits your purpose. So, for example, you could shape a large rock into a weapon, idol, or coffer, or make a small passage through a wall, as long as the wall is less than 5 feet thick. You could also shape a stone door or its frame to seal the door shut. The object you create can have up to two hinges and a latch, but finer mechanical detail isn’t possible.
        </p>
    `;

}
