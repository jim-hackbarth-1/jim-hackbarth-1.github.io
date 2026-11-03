
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Daylight {

    static get name() { return "daylight"; }
    static get title() { return "Daylight"; }
    static get level() { return 3; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric", "druid", "paladin", "ranger", "sorcerer"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(Daylight, Daylight.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Daylight, Daylight.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Daylight.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A 60-foot-radius sphere of light spreads out from a point you choose within range. The sphere is bright light and sheds dim light for an additional 60 feet.
        </p>
        <p>
            If you chose a point on an object you are holding or one that isn’t being worn or carried, the light shines from the object with and moves with it. Completely covering the affected object with an opaque object, such as a bowl or a helm, blocks the light.
        </p>
        <p>
            If any of this spell’s area overlaps with an area of darkness created by a spell of 3rd level or lower, the spell that created the darkness is dispelled.
        </p>
    `;

}
