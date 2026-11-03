
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class RaiseDead {

    static get name() { return "raise-dead"; }
    static get title() { return "Raise Dead"; }
    static get level() { return 5; }
    static get school() { return "necromancy"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "cleric", "paladin"]; }
    static get castingTime() { return "1 hour"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (a diamond worth at least 500 gp, which the spell consumes)"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(RaiseDead, RaiseDead.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(RaiseDead, RaiseDead.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = RaiseDead.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You return a dead creature you touch to life, provided that it has been dead no longer than 10 days. If the creature’s soul is both willing and at liberty to rejoin the body, the creature returns to life with 1 hit point.
        </p>
        <p>
            This spell also neutralizes any poison and cures nonmagical diseases that affected the creature at the time it died. This spell doesn’t, however, remove magical diseases, curses, or similar effects; if these aren’t first removed prior to casting the spell, they take effect when the creature returns to life. The spell can’t return an undead creature to life.
        </p>
        <p>
            This spell closes all mortal wounds, but it doesn’t restore missing body parts. If the creature is lacking body parts or organs integral for its survival – its head, for instance – the spell automatically fails.
        </p>
        <p>
            Coming back from the dead is an ordeal. The target takes a -4 penalty to all attack rolls, saving throws, and ability checks. Every time the target finishes a long rest, the penalty is reduced by 1 until it disappears.
        </p>
    `;

}
