
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Fireball {

    static get name() { return "fireball"; }
    static get title() { return "Fireball"; }
    static get level() { return 3; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "150 feet"; }
    static get components() { return "V, S, M (a tiny ball of bat guano and sulfur)"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(Fireball, Fireball.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo(
            { target: "dc", saveAbility: "dexterity", damageDice: "8d6", damageType: "fire", notes: ["Half damage on save"] });
        tempFeatures.push(character.getSpellCard(Fireball, Fireball.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Fireball.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A bright streak flashes from your pointing finger to a point you choose within range then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot radius must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one. The fire spreads around corners. It ignites flammable objects in the area that aren’t being worn or carried.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.
        </p>
    `;

}
