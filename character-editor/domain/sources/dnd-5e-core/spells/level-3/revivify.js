
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Revivify {

    static get name() { return "revivify"; }
    static get title() { return "Revivify"; }
    static get level() { return 3; }
    static get school() { return "necromancy"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (diamonds worth 300 gp, which the spell consumes)"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(Revivify, Revivify.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Revivify, Revivify.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Revivify.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You touch a creature that has died within the last minute. That creature returns to life with 1 hit point. This spell can’t return to life a creature that has died of old age, nor can it restore any missing body parts.
        </p>
    `;

}
