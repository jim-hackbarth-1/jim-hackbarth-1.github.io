
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class MelfsAcidArrow {

    static get name() { return "melfs-acid-arrow"; }
    static get title() { return "Melf's Acid Arrow"; }
    static get level() { return 2; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "90 feet"; }
    static get components() { return "V, S, M (powdered rhubarb leaf and an adder’s stomach)"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(MelfsAcidArrow, MelfsAcidArrow.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo(
            { target: "to-hit", damageDice: "4d4", damageType: "acid", applyAbilityModifierToDamage: false });
        tempFeatures.push(character.getSpellCard(MelfsAcidArrow, MelfsAcidArrow.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = MelfsAcidArrow.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A shimmering green arrow streaks toward a target within range and bursts in a spray of acid. Make a ranged spell attack against the target. On a hit, the target takes 4d4 acid damage immediately and 2d4 acid damage at the end of its next turn. On a miss, the arrow splashes the target with acid for half as much of the initial damage and no damage at the end of its next turn.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, the damage (both initial and later) increases by 1d4 for each slot level above 2nd.
        </p>
    `;

}
