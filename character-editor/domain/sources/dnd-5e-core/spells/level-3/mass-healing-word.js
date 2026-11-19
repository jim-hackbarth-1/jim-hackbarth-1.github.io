
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class MassHealingWord {

    static get name() { return "mass-healing-word"; }
    static get title() { return "Mass Healing Word"; }
    static get level() { return 3; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric"]; }
    static get castingTime() { return "1 bonus action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(MassHealingWord, MassHealingWord.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(MassHealingWord, MassHealingWord.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = MassHealingWord.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            As you call out words of restoration, up to six creatures of your choice that you can see within range regain hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the healing increases by 1d4 for each slot level above 3rd.
        </p>
    `;

}
