
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class BladeWard {

    static get name() { return "blade-ward"; }
    static get title() { return "Blade Ward"; }
    static get level() { return 0; }
    static get school() { return "abjuration" }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action" }
    static get range() { return "Self" }
    static get components() { return "V, S" }
    static get duration() { return "1 round" }
    static get html() { return DnD5ESource.getSpellHtml(BladeWard, BladeWard.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(BladeWard, BladeWard.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = BladeWard.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You extend your hand and trace a sigil of warding in the air.  Until the end of your next turn, you have resistance against bludgeoning, piercing, and slashing damage dealt by weapon attacks.
        </p>
    `;

}
