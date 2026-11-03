
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Bane {

    static get name() { return "bane"; }
    static get title() { return "Bane"; }
    static get level() { return 1; }
    static get school() { return "enchantment"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "cleric"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S, M (a drop of blood)"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(Bane, Bane.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "charisma" });
        tempFeatures.push(character.getSpellCard(Bane, Bane.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Bane.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Up to three creatures of your choice that you can see within range must make Charisma saving throws. Whenever a target that fails this saving throw makes an attack roll or a saving throw before the spell ends, the target must roll a d4 and subtract the number rolled from the attack roll or saving throw.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.
        </p>
    `;

}
