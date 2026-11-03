
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ShieldOfFaith {

    static get name() { return "shield-of-faith"; }
    static get title() { return "Shield of Faith"; }
    static get level() { return 1; }
    static get school() { return "abjuration" }
    static get isRitual() { return false; }
    static get classes() { return ["cleric", "paladin"]; }
    static get castingTime() { return "1 bonus action" }
    static get range() { return "60 feet" }
    static get components() { return "V, S, M (a small parchment with a bit of holy text written on it)" }
    static get duration() { return "Concentration, up to 10 minutes" }
    static get html() { return DnD5ESource.getSpellHtml(ShieldOfFaith, ShieldOfFaith.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(ShieldOfFaith, ShieldOfFaith.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ShieldOfFaith.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A shimmering field appears and surrounds a creature of your choice within range, granting it a +2 bonus to AC for the duration.
        </p>
    `;

}
