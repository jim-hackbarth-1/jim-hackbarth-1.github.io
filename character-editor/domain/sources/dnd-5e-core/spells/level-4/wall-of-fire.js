
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class WallOfFire {

    static get name() { return "wall-of-fire"; }
    static get title() { return "Wall of Fire"; }
    static get level() { return 4; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "120 feet"; }
    static get components() { return "V, S, M (a small piece of phosphorus)"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(WallOfFire, WallOfFire.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo(
            { target: "dc", saveAbility: "dexterity", damageDice: "5d8", damageType: "fire", notes: ["Half damage on save"] });
        tempFeatures.push(character.getSpellCard(WallOfFire, WallOfFire.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = WallOfFire.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You create a wall of fire on a solid surface within range. You can make the wall up to 60 feet long, 20 feet high, and 1 foot thick, or a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick. The wall is opaque and lasts for the duration.
        </p>
        <p>
            When the wall appears, each creature within its area must make a Dexterity saving throw. On a failed save, a creature takes 5d8 fire damage, or half as much damage on a successful save.
        </p>
        <p>
            One side of the wall, selected by you when you cast this spell, deals 5d8 fire damage to each creature that ends its turn within 10 feet of that side or inside the wall. A creature takes the same damage when it enters the wall for the first time on a turn or ends its turn there. The other side of the wall deals no damage.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 5th level or higher, the damage increases by 1d8 for each slot level above 4th.
        </p>
    `;

}
