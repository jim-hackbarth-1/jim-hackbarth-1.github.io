
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Sanctuary {

    static get name() { return "sanctuary"; }
    static get title() { return "Sanctuary"; }
    static get level() { return 1; }
    static get school() { return "abjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric"]; }
    static get castingTime() { return "1 bonus action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S, M (a small silver mirror)"; }
    static get duration() { return "1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(Sanctuary, Sanctuary.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Sanctuary, Sanctuary.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Sanctuary.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You ward a creature within range against attack. Until the spell ends, any creature who targets the warded creature with an attack or a harmful spell must first make a Wisdom saving throw. On a failed save, the creature must choose a new target or lose the attack or spell. This spell doesn’t protect the warded creature from area effects, such as the explosion of a fireball.
        </p>
        <p>
            If the warded creature makes an attack, casts a spell that affects an enemy, or deals damage to another creature, this spell ends.
        </p>
    `;

}
