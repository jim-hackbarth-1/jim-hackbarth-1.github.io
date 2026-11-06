
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class HuntersMark {

    static get name() { return "hunters-mark"; }
    static get title() { return "Hunter's Mark"; }
    static get level() { return 1; }
    static get school() { return "divination"; }
    static get isRitual() { return false; }
    static get classes() { return ["ranger"]; }
    static get castingTime() { return "1 bonus action"; }
    static get range() { return "90 feet"; }
    static get components() { return "V"; }
    static get duration() { return "Concentration, up to 1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(HuntersMark, HuntersMark.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(HuntersMark, HuntersMark.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = HuntersMark.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You choose a creature you can see within range and mystically mark it as your quarry. Until the spell ends, you deal an extra 1d6 damage to the target whenever you hit it with a weapon attack, and you have advantage on any Wisdom (Perception) or Wisdom (Survival) check you make to find it.
        </p>
        <p>
            If the target drops to 0 hit points before this spell ends, you can use a bonus action on a subsequent turn of yours to mark a new creature.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 3rd or 4th level, you can maintain your concentration on the spell for up to 8 hours. When you use a spell slot of 5th level or higher, you can maintain your concentration on the spell for up to 24 hours.
        </p>
    `;

}
