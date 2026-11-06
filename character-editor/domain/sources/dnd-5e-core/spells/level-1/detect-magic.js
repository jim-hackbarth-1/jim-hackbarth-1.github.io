
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class DetectMagic {

    static get name() { return "detect-magic"; }
    static get title() { return "Detect Magic"; }
    static get level() { return 1; }
    static get school() { return "divination"; }
    static get isRitual() { return true; }
    static get classes() { return ["bard", "cleric", "druid", "paladin", "ranger", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self"; }
    static get components() { return "V, S"; }
    static get duration() { return "Concentration, up to 10 minutes"; }
    static get html() { return DnD5ESource.getSpellHtml(DetectMagic, DetectMagic.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(DetectMagic, DetectMagic.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = DetectMagic.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            For the duration, you sense the presence of magic within 30 feet of you. If you sense magic in this way, you can use your action to see a faint aura around any visible creature or object in the area that bears magic, and you learn its school of magic, if any.
        </p>
        <p>
            The spell can penetrate most barriers, but is blocked by 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood or dirt.
        </p>
    `;

}
