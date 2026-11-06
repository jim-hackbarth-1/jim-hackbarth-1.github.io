
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class DetectEvilAndGood {

    static get name() { return "detect-evil-and-good"; }
    static get title() { return "Detect Evil and Good"; }
    static get level() { return 1; }
    static get school() { return "divination"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric", "paladin"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self"; }
    static get components() { return "V, S"; }
    static get duration() { return "Concentration, up to 10 minutes"; }
    static get html() { return DnD5ESource.getSpellHtml(DetectEvilAndGood, DetectEvilAndGood.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(DetectEvilAndGood, DetectEvilAndGood.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = DetectEvilAndGood.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            For the duration, you know if there is an aberration, celestial, elemental, fey, fiend, or undead within 30 feet of you, as well as where the creature is located. Similarly, you know if there is a place or object within 30 feet of you that has been magically consecrated or desecrated.
        </p>
        <p>
            The spell can penetrate most barriers, but it is blocked by 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood or dirt.
        </p>
    `;

}
