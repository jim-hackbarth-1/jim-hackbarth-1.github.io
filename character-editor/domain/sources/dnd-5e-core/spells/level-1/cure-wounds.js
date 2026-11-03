
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class CureWounds {

    static get name() { return "cure-wounds"; }
    static get title() { return "Cure Wounds"; }
    static get level() { return 1; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "cleric", "druid", "paladin", "ranger"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(CureWounds, CureWounds.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(CureWounds, CureWounds.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = CureWounds.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st.
        </p>
    `;

}
