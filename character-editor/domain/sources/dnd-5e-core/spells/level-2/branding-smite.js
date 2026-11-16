
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class BrandingSmite {

    static get name() { return "branding-smite"; }
    static get title() { return "Branding Smite"; }
    static get level() { return 2; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["paladin"]; }
    static get castingTime() { return "1 bonus action"; }
    static get range() { return "Self"; }
    static get components() { return "V"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(BrandingSmite, BrandingSmite.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(BrandingSmite, BrandingSmite.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = BrandingSmite.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            The next time you hit a creature with a weapon attack before this spell ends, the weapon gleams with astral radiance as you strike. The attack deals an extra 2d6 radiant damage to the target, which becomes visible if it is invisible, and the target sheds dim light in a 5-foot radius and can’t become invisible until the spell ends.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, the extra damage increases by 1d6 for each slot level above 2nd.
        </p>
    `;

}
