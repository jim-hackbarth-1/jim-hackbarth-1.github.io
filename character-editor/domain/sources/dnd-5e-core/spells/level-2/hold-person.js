
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class HoldPerson {

    static get name() { return "hold-person"; }
    static get title() { return "Hold Person"; }
    static get level() { return 2; }
    static get school() { return "enchantment"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "cleric", "druid", "sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, S, M (a small, straight piece of iron)"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(HoldPerson, HoldPerson.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "wisdom" });
        tempFeatures.push(character.getSpellCard(HoldPerson, HoldPerson.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = HoldPerson.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Choose a humanoid that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, you can target one additional humanoid for each slot level above 2nd. The humanoids must be within 30 feet of each other when you target them.
        </p>
    `;

}
