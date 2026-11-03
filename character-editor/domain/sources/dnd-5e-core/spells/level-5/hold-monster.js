
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class HoldMonster {

    static get name() { return "hold-monster"; }
    static get title() { return "Hold Monster"; }
    static get level() { return 5; }
    static get school() { return "enchantment"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "90 feet"; }
    static get components() { return "V, S, M (a small, straight piece of iron)"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "wisdom" });
        tempFeatures.push(character.getSpellCard(HoldMonster, HoldMonster.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = HoldMonster.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Choose a creature that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. This spell has no effect on undead. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 6th level or higher, you can target one additional creature for each slot level above 5th. The creatures must be within 30 feet of each other when you target them.
        </p>
    `;

}
