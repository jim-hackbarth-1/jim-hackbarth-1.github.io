
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class HealingWord {

    static get name() { return "healing-word"; }
    static get title() { return "Healing Word"; }
    static get level() { return 1; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "cleric", "druid"]; }
    static get castingTime() { return "1 bonus action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(HealingWord, HealingWord.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(HealingWord, HealingWord.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = HealingWord.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A creature of your choice that you can see within range regains hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d4 for each slot level above 1st.
        </p>
    `;

}
