
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class AuraOfVitality {

    static get name() { return "aura-of-vitality"; }
    static get title() { return "Aura of Vitality"; }
    static get level() { return 3; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["paladin"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self (30-foot radius)"; }
    static get components() { return "V"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(AuraOfVitality, AuraOfVitality.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(AuraOfVitality, AuraOfVitality.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = AuraOfVitality.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Healing energy radiates from you in an aura with a 30-foot radius. Until the spell ends, the aura moves with you, centered on you. You can use a bonus action to cause one creature in the aura (including you) to regain 2d6 hit points.
        </p>
    `;

}
