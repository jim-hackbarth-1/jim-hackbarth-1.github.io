
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Thunderwave {

    static get name() { return "thunderwave"; }
    static get title() { return "Thunderwave"; }
    static get level() { return 1; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "druid", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self (15-foot cube)"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(Thunderwave, Thunderwave.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo(
            { target: "dc", saveAbility: "constitution", damageDice: "2d8", damageType: "thunder", notes: ["Half damage on save"] });
        tempFeatures.push(character.getSpellCard(Thunderwave, Thunderwave.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Thunderwave.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn’t pushed.
        </p>
        <p>
            In addition, unsecured objects that are completely within the area of effect are automatically pushed 10 feet away from you by the spell’s effect, and the spell emits a thunderous boom audible out to 300 feet.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.
        </p>
    `;

}
