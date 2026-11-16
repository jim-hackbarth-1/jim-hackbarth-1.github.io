
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Blur {

    static get name() { return "blur"; }
    static get title() { return "Blur"; }
    static get level() { return 2; }
    static get school() { return "illusion"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self"; }
    static get components() { return "V"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(Blur, Blur.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Blur, Blur.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Blur.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Your body becomes blurred, shifting and wavering to all who can see you. For the duration, any creature has disadvantage on attack rolls against you. An attacker is immune to this effect if it doesn't rely on sight, as with blindsight, or can see through illusions, as with truesight.
        </p>
    `;

}
