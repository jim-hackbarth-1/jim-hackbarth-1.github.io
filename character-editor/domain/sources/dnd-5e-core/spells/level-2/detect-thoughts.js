
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class DetectThoughts {

    static get name() { return "detect-thoughts"; }
    static get title() { return "Detect Thoughts"; }
    static get level() { return 2; }
    static get school() { return "divination"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self"; }
    static get components() { return "V, S, M (a copper piece)"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(DetectThoughts, DetectThoughts.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "wisdom" });
        tempFeatures.push(character.getSpellCard(DetectThoughts, DetectThoughts.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = DetectThoughts.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            For the duration, you can read the thoughts of certain creatures. When you cast the spell and as your action on each turn until the spell ends, you can focus your mind on any one creature that you can see within 30 feet of you. If the creature you choose has an Intelligence of 3 or lower or doesn’t speak any language, the creature is unaffected.
        </p>
        <p>
            You initially learn the surface thoughts of the creature - what is most on its mind in that moment. As an action, you can either shift your attention to another creature’s thoughts or attempt to probe deeper into the same creature’s mind. If you probe deeper, the target must make a Wisdom saving throw. If it fails, you gain insight into its reasoning (if any), its emotional state, and something that looms large in its mind (such as something it worries over, loves, or hates). If it succeeds, the spell ends. Either way, the target knows that you are probing into its mind, and unless you shift your attention to another creature’s thoughts, the creature can use its action on its turn to make an Intelligence check contested by your Intelligence check; if it succeeds, the spell ends.
        </p>
        <p>
            Questions verbally directed at the target creature naturally shape the course of its thoughts, so this spell is particularly effective as part of an interrogation.
        </p>
        <p>
            You can also use this spell to detect the presence of thinking creatures you can’t see. When you cast the spell or as your action during the duration, you can search for thoughts within 30 feet of you. The spell can penetrate barriers, but 2 feet of rock, 2 inches of any metal other than lead, or a thin sheet of lead blocks you. You can’t detect a creature with an Intelligence of 3 or lower or one that doesn’t speak any language.
        </p>
        <p>
            Once you detect the presence of a creature in this way, you can read its thoughts for the rest of the duration as described above, even if you can’t see it, but it must still be within range.
        </p>
    `;

}
