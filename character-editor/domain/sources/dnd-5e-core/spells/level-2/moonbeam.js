
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Moonbeam {

    static get name() { return "moonbeam"; }
    static get title() { return "Moonbeam"; }
    static get level() { return 2; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "120 feet"; }
    static get components() { return "V, S, M (several seeds of any moonseed plant and a piece of opalescent feldspar)"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(Moonbeam, Moonbeam.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo(
            { target: "dc", saveAbility: "constitution", damageDice: "2d10", damageType: "radiant", notes: ["Half damage on save"] });
        tempFeatures.push(character.getSpellCard(Moonbeam, Moonbeam.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Moonbeam.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A silvery beam of pale light shines down in a 5-foot radius, 40-foot-high cylinder centered on a point within range. Until the spell ends, dim light fills the cylinder.
        </p>
        <p>
            When a creature enters the spell’s area for the first time on a turn or starts its turn there, it is engulfed in ghostly flames that cause searing pain, and it must make a Constitution saving throw. It takes 2d10 radiant damage on a failed save, or half as much damage on a successful one.
        </p>
        <p>
            A shapechanger makes its saving throw with disadvantage. If it fails, it also instantly reverts to its original form and can’t assume a different form until it leaves the spell’s light.
        </p>
        <p>
            On each of your turns after you cast this spell, you can use an action to move the beam up to 60 feet in any direction.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d10 for each slot level above 2nd.
        </p>
    `;

}
