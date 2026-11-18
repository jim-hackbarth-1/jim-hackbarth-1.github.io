
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ProtectionFromEnergy {

    static get name() { return "protection-from-energy"; }
    static get title() { return "Protection from Energy"; }
    static get level() { return 3; }
    static get school() { return "abjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric", "druid", "ranger", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S"; }
    static get duration() { return "Concentration, up to 1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(ProtectionFromEnergy, ProtectionFromEnergy.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(ProtectionFromEnergy, ProtectionFromEnergy.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ProtectionFromEnergy.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            For the duration, the willing creature you touch has resistance to one damage type of your choice: acid, cold, fire, lightning, or thunder.
        </p>
    `;

}
