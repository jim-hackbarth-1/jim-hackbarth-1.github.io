
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class RayOfSickness {

    static get name() { return "ray-of-sickness"; }
    static get title() { return "Ray of Sickness"; }
    static get level() { return 1; }
    static get school() { return "necromancy"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(RayOfSickness, RayOfSickness.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const dcAttackInfo = character.getAttackInfo({ target: "dc", saveAbility: "constitution" });
        const dcCard = character.getSpellCard(RayOfSickness, RayOfSickness.#content, characterSpellClasses, dcAttackInfo);
        const dcDescription = dcCard.attacks[0].description;
        const attackInfo = character.getAttackInfo(
            { target: "to-hit", damageDice: "2d8", damageType: "poison", applyAbilityModifierToDamage: false, notes: [`(${dcDescription})`] });
        tempFeatures.push(character.getSpellCard(RayOfSickness, RayOfSickness.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = RayOfSickness.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A ray of sickening greenish energy lashes out toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 2d8 poison damage and must make a Constitution saving throw. On a failed save, it is also poisoned until the end of your next turn.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.
        </p>
    `;

}
