
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class HypnoticPattern {

    static get name() { return "hypnotic-pattern"; }
    static get title() { return "Hypnotic Pattern"; }
    static get level() { return 3; }
    static get school() { return "illusion"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "120 feet"; }
    static get components() { return "S, M (a glowing stick of incense or a crystal vial filled with phosphorescent material)"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(HypnoticPattern, HypnoticPattern.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "wisdom" });
        tempFeatures.push(character.getSpellCard(HypnoticPattern, HypnoticPattern.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = HypnoticPattern.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You create a twisting pattern of colors that weaves through the air inside a 30-foot cube within range. The pattern appears for a moment and vanishes. Each creature in the area who sees the pattern must make a Wisdom saving throw. On a failed save, the creature becomes charmed for the duration. While charmed by this spell, the creature is incapacitated and has a speed of 0.
        </p>
        <p>
            The spell ends for an affected creature if it takes any damage or if someone else uses an action to shake the creature out of its stupor.
        </p>
    `;

}
