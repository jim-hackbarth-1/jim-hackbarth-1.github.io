
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class CrusadersMantle {

    static get name() { return "crusaders-mantle"; }
    static get title() { return "Crusader's Mantle"; }
    static get level() { return 3; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["paladin"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self"; }
    static get components() { return "V"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(CrusadersMantle, CrusadersMantle.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(CrusadersMantle, CrusadersMantle.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = CrusadersMantle.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Holy power radiates from you in an aura with a 30-foot radius, awakening boldness in friendly creatures. Until the spell ends, the aura moves with you, centered on you. While in the aura, each non-hostile creature in the aura (including you) deals an extra 1d4 radiant damage when it hits with a weapon attack.
        </p>
    `;

}
