
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class PrayerOfHealing {

    static get name() { return "prayer-of-healing"; }
    static get title() { return "Prayer of Healing"; }
    static get level() { return 2; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric"]; }
    static get castingTime() { return "10 minutes"; }
    static get range() { return "30 feet"; }
    static get components() { return "V"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(PrayerOfHealing, PrayerOfHealing.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(PrayerOfHealing, PrayerOfHealing.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = PrayerOfHealing.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Up to six creatures of your choice that you can see within range each regain hit points equal to 2d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, the healing increases by 1d8 for each slot level above 2nd.
        </p>
    `;

}
