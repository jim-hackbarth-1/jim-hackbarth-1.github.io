
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class HailOfThorns {

    static get name() { return "hail-of-thorns"; }
    static get title() { return "Hail of Thorns"; }
    static get level() { return 1; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["ranger"]; }
    static get castingTime() { return "1 bonus action"; }
    static get range() { return "Self"; }
    static get components() { return "V"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(HailOfThorns, HailOfThorns.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo(
            { target: "dc", saveAbility: "dexterity", damageDice: "1d10", damageType: "piercing", notes: ["Half damage on save"] });
        tempFeatures.push(character.getSpellCard(HailOfThorns, HailOfThorns.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = HailOfThorns.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            The next time you hit a creature with a ranged weapon attack before the spell ends, this spell creates a rain of thorns that sprouts from your ranged weapon or ammunition. In addition to the normal effect of the attack, the target of the attack and each creature within 5 feet of it must make a Dexterity saving throw. A creature takes 1d10 piercing damage on a failed save, or half as much damage on a successful one.
        </p>
        <p>
            At Higher Levels. If you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st (to a maximum of 6d10).
        </p>
    `;

}
