
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class LesserRestoration {

    static get name() { return "lesser-restoration"; }
    static get title() { return "Lesser Restoration"; }
    static get level() { return 2; }
    static get school() { return "abjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "cleric", "druid", "paladin", "ranger"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(LesserRestoration, LesserRestoration.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(LesserRestoration, LesserRestoration.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = LesserRestoration.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You touch a creature and can end either one disease or one condition afflicting it. The condition can be blinded, deafened, paralyzed, or poisoned.
        </p>
    `;

}
