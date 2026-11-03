
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class IceStorm {

    static get name() { return "ice-storm"; }
    static get title() { return "Ice Storm"; }
    static get level() { return 4; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "300 feet"; }
    static get components() { return "V, S, M (a pinch of dust and a few drops of water)"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(IceStorm, IceStorm.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo(
            { target: "dc", saveAbility: "dexterity", damageDice: "2d8+4d6", damageType: "bludgeoning / cold", notes: ["Half damage on save"] });
        tempFeatures.push(character.getSpellCard(IceStorm, IceStorm.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = IceStorm.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A hail of rock-hard ice pounds to the ground in a 20-foot-radius, 40-foot-high cylinder centered on a point within range. Each creature in the cylinder must make a Dexterity saving throw. A creature takes 2d8 bludgeoning damage and 4d6 cold damage on a failed save, or half as much damage on a successful one.
        </p>
        <p>
            Hailstones turn the storm’s area of effect into difficult terrain until the end of your next turn.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 5th level or higher, the bludgeoning damage increases by 1d8 for each slot level above 4th.
        </p>
    `;

}
