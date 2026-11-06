
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class FeatherFall {

    static get name() { return "feather-fall"; }
    static get title() { return "Feather Fall"; }
    static get level() { return 1; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 reaction"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, M (a small feather or piece of down)"; }
    static get duration() { return "1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(FeatherFall, FeatherFall.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(FeatherFall, FeatherFall.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = FeatherFall.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Choose up to five falling creatures within range. A falling creature’s rate of descent slows to 60 feet per round until the spell ends. If the creature lands before the spell ends, it takes no falling damage and can land on its feet, and the spell ends for that creature.
        </p>
    `;

}
