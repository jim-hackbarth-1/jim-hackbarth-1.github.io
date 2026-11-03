
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class GustOfWind {

    static get name() { return "gust-of-wind"; }
    static get title() { return "Gust of Wind"; }
    static get level() { return 2; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self (60-foot line)"; }
    static get components() { return "V, S, M (a legume seed)"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(GustOfWind, GustOfWind.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "strength" });
        tempFeatures.push(character.getSpellCard(GustOfWind, GustOfWind.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = GustOfWind.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A line of strong wind 60 feet long and 10 feet wide blasts from you in a direction you choose for the spell’s duration. Each creature that starts its turn in the line must succeed on a Strength saving throw or be pushed 15 feet away from you in a direction following the line.
        </p>
        <p>
            Any creature in the line must spend 2 feet of movement for every 1 foot it moves when moving closer to you.
        </p>
        <p>
            The gust disperses gas or vapor, and it extinguishes candles, torches, and similar unprotected flames in the area. It causes protected flames, such as those of lanterns, to dance wildly and has a 50 percent chance to extinguish them.
        </p>
        <p>
            As a bonus action on each of your turns before the spell ends, you can change the direction in which the line blasts from you.
        </p>
    `;

}
