
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class HellishRebuke {

    static get name() { return "hellish-rebuke"; }
    static get title() { return "Hellish Rebuke"; }
    static get level() { return 1; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["warlock"]; }
    static get castingTime() { return "1 reaction"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(HellishRebuke, HellishRebuke.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo(
            { target: "dc", saveAbility: "dexterity", damageDice: "2d10", damageType: "fire", notes: ["Half damage on save"] });
        tempFeatures.push(character.getSpellCard(HellishRebuke, HellishRebuke.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = HellishRebuke.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You point your finger, and the creature that damaged you is momentarily surrounded by hellish flames. The creature must make a Dexterity saving throw. It takes 2d10 fire damage on a failed save, or half as much damage on a successful one.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.
        </p>
    `;

}
