
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ExpeditiousRetreat {

    static get name() { return "expeditious-retreat"; }
    static get title() { return "Expeditious Retreat"; }
    static get level() { return 1; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 bonus action"; }
    static get range() { return "Self"; }
    static get components() { return "V, S"; }
    static get duration() { return "Concentration, up to 10 minutes"; }
    static get html() { return DnD5ESource.getSpellHtml(ExpeditiousRetreat, ExpeditiousRetreat.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(ExpeditiousRetreat, ExpeditiousRetreat.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ExpeditiousRetreat.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            This spell allows you to move at an incredible pace. When you cast this spell, and then as a bonus action on each of your turns until the spell ends, you can take the Dash action.
        </p>
    `;

}
