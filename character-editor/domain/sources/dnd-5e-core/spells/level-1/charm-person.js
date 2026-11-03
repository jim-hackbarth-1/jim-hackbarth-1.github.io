
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class CharmPerson {

    static get name() { return "charm-person"; }
    static get title() { return "Charm Person"; }
    static get level() { return 1; }
    static get school() { return "enchantment"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "druid", "sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(CharmPerson, CharmPerson.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "wisdom" });
        tempFeatures.push(character.getSpellCard(CharmPerson, CharmPerson.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = CharmPerson.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You attempt to charm a humanoid you can see within range. It must make a Wisdom saving throw, and does so with advantage if you or your companions are fighting it. If it fails the saving throw, it is charmed by you until the spell ends or until you or your companions do anything harmful to it. The charmed creature regards you as a friendly acquaintance. When the spell ends, the creature knows it was charmed by you.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them.
        </p>
    `;

}
