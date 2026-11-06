
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ColorSpray {

    static get name() { return "color-spray"; }
    static get title() { return "Color Spray"; }
    static get level() { return 1; }
    static get school() { return "illusion"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self (15-foot cone)"; }
    static get components() { return "V, S, M (a pinch of powder or sand that is colored red, yellow, and blue)"; }
    static get duration() { return "1 round"; }
    static get html() { return DnD5ESource.getSpellHtml(ColorSpray, ColorSpray.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(ColorSpray, ColorSpray.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ColorSpray.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A dazzling array of flashing, colored light springs from your hand. Roll 6d10, the total is how many hit points of creatures this spell can effect. Creatures in a 15-foot cone originating from you are affected in ascending order of their current hit points (ignoring unconscious creatures and creatures that can’t see).
        </p>
        <p>
            Starting with the creature that has the lowest current hit points, each creature affected by this spell is blinded until the end of your next turn. Subtract each creature’s hit points from the total before moving on to the creature with the next lowest hit points. A creature’s hit points must be equal to or less than the remaining total for the creature to be affected.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, roll an additional 2d10 for each slot level above 1st.
        </p>
    `;

}
