
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class MassCureWounds {

    static get name() { return "mass-cure-wounds"; }
    static get title() { return "Mass Cure Wounds"; }
    static get level() { return 5; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "cleric", "druid"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(MassCureWounds, MassCureWounds.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(MassCureWounds, MassCureWounds.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = MassCureWounds.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A wave of healing energy washes out from a point of your choice within range. Choose up to six creatures in a 30-foot-radius sphere centered on that point. Each target regains hit points equal to 3d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 6th level or higher, the healing increases by 1d8 for each slot level above 5th.
        </p>
    `;

}
