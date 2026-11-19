
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class LightningArrow {

    static get name() { return "lightning-arrow"; }
    static get title() { return "Lightning Arrow"; }
    static get level() { return 3; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["ranger"]; }
    static get castingTime() { return "1 bonus action"; }
    static get range() { return "Self"; }
    static get components() { return "V, S"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(LightningArrow, LightningArrow.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo(
            { target: "dc", saveAbility: "dexterity", damageDice: "2d6", damageType: "lightning", notes: ["Half damage on save"] });
        tempFeatures.push(character.getSpellCard(LightningArrow, LightningArrow.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = LightningArrow.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            The next time you make a ranged weapon attack during the spell’s duration, the weapon’s ammunition, or the weapon itself if it’s a thrown weapon, transforms into a bolt of lightning. Make the attack roll as normal. The target takes 4d8 lightning damage on a hit, or half as much damage on a miss, instead of the weapon’s normal damage.
        </p>
        <p>
            Whether you hit or miss, each creature within 10 feet of the target must make a Dexterity saving throw. Each of these creatures takes 2d8 lightning damage on a failed save, or half as much damage on a successful one.
        </p>
        <p>
            The piece of ammunition or weapon then returns to its normal form.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the damage for both effects of the spell increases by 1d8 for each slot level above 3rd.
        </p>
    `;

}
