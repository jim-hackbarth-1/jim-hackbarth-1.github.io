
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class WaterBreathing {

    static get name() { return "water-breathing"; }
    static get title() { return "Water Breathing"; }
    static get level() { return 3; }
    static get school() { return "transmutation"; }
    static get isRitual() { return true; }
    static get classes() { return ["druid", "ranger", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S, M (a short reed or piece of straw)"; }
    static get duration() { return "24 hours"; }
    static get html() { return DnD5ESource.getSpellHtml(WaterBreathing, WaterBreathing.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(WaterBreathing, WaterBreathing.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = WaterBreathing.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            This spell grants up to ten willing creatures you can see within range the ability to breathe underwater until the spell ends. Affected creatures also retain their normal mode of respiration.
        </p>
    `;

}
