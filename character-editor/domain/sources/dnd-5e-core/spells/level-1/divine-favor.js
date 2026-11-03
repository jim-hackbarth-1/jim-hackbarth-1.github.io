
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class DivineFavor {

    static get name() { return "divine-favor"; }
    static get title() { return "Divine Favor"; }
    static get level() { return 1; }
    static get school() { return "evocation" }
    static get isRitual() { return false; }
    static get classes() { return ["paladin"]; }
    static get castingTime() { return "1 bonus action" }
    static get range() { return "Self" }
    static get components() { return "V, S" }
    static get duration() { return "Concentration, up to 1 minute" }
    static get html() { return DnD5ESource.getSpellHtml(DivineFavor, DivineFavor.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(DivineFavor, DivineFavor.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = DivineFavor.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Your prayer empowers you with divine radiance. Until the spell ends, your weapon attacks deal an extra 1d4 radiant damage on a hit.
        </p>
    `;

}

