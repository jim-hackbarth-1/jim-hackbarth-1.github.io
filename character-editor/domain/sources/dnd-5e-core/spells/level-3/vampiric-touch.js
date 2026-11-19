
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class VampiricTouch {

    static get name() { return "vampiric-touch"; }
    static get title() { return "Vampiric Touch"; }
    static get level() { return 3; }
    static get school() { return "necromancy"; }
    static get isRitual() { return false; }
    static get classes() { return ["warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self"; }
    static get components() { return "V, S"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(VampiricTouch, VampiricTouch.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo(
            { target: "to-hit", damageDice: "3d6", damageType: "necrotic", applyAbilityModifierToDamage: false });
        tempFeatures.push(character.getSpellCard(VampiricTouch, VampiricTouch.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = VampiricTouch.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            The touch of your shadow-wreathed hand can siphon force from others to heal your wounds. Make a melee spell attack against a creature within your reach. On a hit, the target takes 3d6 necrotic damage, and you regain hit points equal to half the amount of necrotic damage dealt. Until the spell ends, you can make the attack again on each of your turns as an action.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.
        </p>
    `;

}
