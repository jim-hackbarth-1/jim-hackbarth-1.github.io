
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Counterspell {

    static get name() { return "counterspell"; }
    static get title() { return "Counterspell"; }
    static get level() { return 3; }
    static get school() { return "abjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 reaction, which you take when you see a creature within 60 feet of you casting a spell"; }
    static get range() { return "60 feet"; }
    static get components() { return "S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(Counterspell, Counterspell.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Counterspell, Counterspell.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Counterspell.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You attempt to interrupt a creature in the process of casting a spell. If the creature is casting a spell of 3rd level or lower, its spell fails and has no effect. If it is casting a spell of 4th level or higher, make an ability check using your spellcasting ability. The DC equals 10 + the spell’s level. On a success, the creature’s spell fails and has no effect.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the interrupted spell has no effect if its level is less than or equal to the level of the spell slot you used.
        </p>
    `;

}
