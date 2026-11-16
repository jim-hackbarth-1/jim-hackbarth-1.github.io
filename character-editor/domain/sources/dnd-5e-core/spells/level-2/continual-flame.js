
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ContinualFlame {

    static get name() { return "continual-flame"; }
    static get title() { return "Continual Flame"; }
    static get level() { return 2; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (ruby dust worth 50 gp, which the spell consumes)"; }
    static get duration() { return "Until dispelled"; }
    static get html() { return DnD5ESource.getSpellHtml(ContinualFlame, ContinualFlame.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(ContinualFlame, ContinualFlame.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ContinualFlame.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A flame, equivalent in brightness to a torch, springs forth from an object that you touch. The effect looks like a regular flame, but it creates no heat and doesn’t use oxygen. A continual flame can be covered or hidden but not smothered or quenched.
        </p>
    `;

}
