
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class SpiderClimb {

    static get name() { return "spider-climb"; }
    static get title() { return "Spider Climb"; }
    static get level() { return 2; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (a drop of bitumen and a spider)"; }
    static get duration() { return "Concentration, up to 1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(SpiderClimb, SpiderClimb.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(SpiderClimb, SpiderClimb.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = SpiderClimb.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Until the spell ends, one willing creature you touch gains the ability to move up, down, and across vertical surfaces and upside down along ceilings, while leaving its hands free. The target also gains a climbing speed equal to its walking speed.
        </p>
    `;

}
