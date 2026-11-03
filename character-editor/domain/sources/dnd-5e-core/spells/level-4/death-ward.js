
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class DeathWard {

    static get name() { return "death-ward"; }
    static get title() { return "Death Ward"; }
    static get level() { return 4; }
    static get school() { return "abjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric", "paladin"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S"; }
    static get duration() { return "8 hours"; }
    static get html() { return DnD5ESource.getSpellHtml(DeathWard, DeathWard.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(DeathWard, DeathWard.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = DeathWard.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You touch a creature and grant it a measure of protection from death. The first time the target would drop to 0 hit points as a result of taking damage, the target instead drops to 1 hit point, and the spell ends. If the spell is still in effect when the target is subjected to an effect that would kill it instantaneously without dealing damage, that effect is instead negated against the target, and the spells ends.
        </p>
    `;

}
