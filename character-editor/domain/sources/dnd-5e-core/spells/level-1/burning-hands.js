
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class BurningHands {

    static get name() { return "burning-hands"; }
    static get title() { return "Burning Hands"; }
    static get level() { return 1; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self (15-foot cone)"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(BurningHands, BurningHands.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];

        const attackInfo = character.getAttackInfo(
            { target: "dc", saveAbility: "dexterity", damageDice: "3d6", damageType: "fire", notes: ["Half damage on save"] });
        tempFeatures.push(character.getSpellCard(BurningHands, BurningHands.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = BurningHands.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            As you hold your hands with thumbs touching and fingers spread, a thin sheet of flames shoots forth from your outstretched fingertips. Each creature in a 15-foot cone must make a Dexterity saving throw. A creature takes 3d6 fire damage on a failed save, or half as much damage on a successful one.
        </p>
        <p>
            The fire ignites any flammable objects in the area that aren’t being worn or carried.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.
        </p>
    `;

}

