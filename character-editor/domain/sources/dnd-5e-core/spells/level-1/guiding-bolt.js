
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class GuidingBolt {

    static get name() { return "guiding-bolt"; }
    static get title() { return "Guiding Bolt"; }
    static get level() { return 1; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "120 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "1 round"; }
    static get html() { return DnD5ESource.getSpellHtml(GuidingBolt, GuidingBolt.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo(
            { target: "to-hit", damageDice: "4d6", damageType: "radiant", applyAbilityModifierToDamage: false });
        tempFeatures.push(character.getSpellCard(GuidingBolt, GuidingBolt.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = GuidingBolt.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A flash of light streaks toward a creature of your choice within range. Make a ranged spell attack against the target. On a hit, the target takes 4d6 radiant damage, and the next attack roll made against this target before the end of your next turn has advantage, thanks to the mystical dim light glittering on the target until then.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.
        </p>
    `;

}
