
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class BeastSense {

    static get name() { return "beast-sense"; }
    static get title() { return "Beast Sense"; }
    static get level() { return 2; }
    static get school() { return "divination"; }
    static get isRitual() { return true; }
    static get classes() { return ["druid", "ranger"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "S"; }
    static get duration() { return "Concentration, up to 1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(BeastSense, BeastSense.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(BeastSense, BeastSense.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = BeastSense.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You touch a willing beast. For the duration of the spell, you can use your action to see through the beast’s eyes and hear what it hears, and continue to do so until you use your action to return to your normal senses.
        </p>
    `;

}
