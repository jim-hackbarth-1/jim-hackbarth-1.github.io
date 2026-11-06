
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ChromaticOrb {

    static get name() { return "chromatic-orb"; }
    static get title() { return "Chromatic Orb"; }
    static get level() { return 1; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "90 feet"; }
    static get components() { return "V, S, M (a diamond worth at least 50 gp)"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(ChromaticOrb, ChromaticOrb.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo(
            { target: "to-hit", damageDice: "3d8", damageType: "varies", applyAbilityModifierToDamage: false });
        tempFeatures.push(character.getSpellCard(ChromaticOrb, ChromaticOrb.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ChromaticOrb.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You hurl a 4-inch-diameter sphere of energy at a creature that you can see within range. You choose acid, cold, fire, lightning, poison, or thunder for the type of orb you create, and then make a ranged spell attack against the target. If the attack hits, the creature takes 3d8 damage of the type you chose.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.
        </p>
    `;

}
