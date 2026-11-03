
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Shatter {

    static get name() { return "shatter"; }
    static get title() { return "Shatter"; }
    static get level() { return 2; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, S, M (a chip of mica)"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(Shatter, Shatter.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo(
            { target: "dc", saveAbility: "constitution", damageDice: "2d8", damageType: "thunder", notes: ["Half damage on save"] });
        tempFeatures.push(character.getSpellCard(Shatter, Shatter.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Shatter.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A sudden loud ringing noise, painfully intense, erupts from a point of your choice within range. Each creature in a 10-foot-radius sphere centered on that point must make a Constitution saving throw. A creature takes 3d8 thunder damage on a failed save, or half as much damage on a successful one. A creature made of inorganic material such as stone, crystal, or metal has disadvantage on this saving throw.
        </p>
        <p>
            A nonmagical object that isn’t being worn or carried also takes the damage if it’s in the spell’s area.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd.
        </p>
    `;

}
