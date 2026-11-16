/*
2nd-level necromancy

Casting Time: 1 action
Range: 60 feet
Components: V, S
Duration: Concentration, up to 1 minute

A black beam of enervating energy springs from your finger toward a creature within range. Make a ranged spell attack against the target. On a hit, the target deals only half damage with weapon attacks that use Strength until the spell ends.

At the end of each of the target’s turns, it can make a Constitution saving throw against the spell. On a success, the spell ends.

Spell Lists. Warlock, Wizard
*/


import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class RayOfEnfeeblement {

    static get name() { return "ray-of-enfeeblement"; }
    static get title() { return "Ray of Enfeeblement"; }
    static get level() { return 2; }
    static get school() { return "necromancy"; }
    static get isRitual() { return false; }
    static get classes() { return ["warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(RayOfEnfeeblement, RayOfEnfeeblement.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const dcAttackInfo = character.getAttackInfo({ target: "dc", saveAbility: "constitution" });
        const dcCard = character.getSpellCard(RayOfEnfeeblement, RayOfEnfeeblement.#content, characterSpellClasses, dcAttackInfo);
        const dcDescription = dcCard.attacks[0].description;
        const attackInfo = character.getAttackInfo({ target: "to-hit", notes: [`(${dcDescription})`] });
        tempFeatures.push(character.getSpellCard(RayOfEnfeeblement, RayOfEnfeeblement.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = RayOfEnfeeblement.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A black beam of enervating energy springs from your finger toward a creature within range. Make a ranged spell attack against the target. On a hit, the target deals only half damage with weapon attacks that use Strength until the spell ends.
        </p>
        <p>
            At the end of each of the target’s turns, it can make a Constitution saving throw against the spell. On a success, the spell ends.
        </p>
    `;

}
