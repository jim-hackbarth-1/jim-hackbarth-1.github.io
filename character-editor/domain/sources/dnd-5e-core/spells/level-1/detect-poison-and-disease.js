
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class DetectPoisonAndDisease {

    static get name() { return "detect-poison-and-disease"; }
    static get title() { return "Detect Poison and Disease"; }
    static get level() { return 1; }
    static get school() { return "divination"; }
    static get isRitual() { return true; }
    static get classes() { return ["cleric", "druid", "paladin", "ranger"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self"; }
    static get components() { return "V, S, M (a yew leaf)"; }
    static get duration() { return "Concentration, up to 10 minutes"; }
    static get html() { return DnD5ESource.getSpellHtml(DetectPoisonAndDisease, DetectPoisonAndDisease.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(DetectPoisonAndDisease, DetectPoisonAndDisease.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = DetectPoisonAndDisease.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            For the duration, you can sense the presence and location of poisons, poisonous creatures, and diseases within 30 feet of you. You also identify the kind of poison, poisonous creature, or disease in each case.
        </p>
        <p>
            The spell can penetrate most barriers, but is blocked by 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood or dirt.
        </p>
    `;

}
