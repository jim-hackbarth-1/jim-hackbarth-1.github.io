
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Enthrall {

    static get name() { return "enthrall"; }
    static get title() { return "Enthrall"; }
    static get level() { return 2; }
    static get school() { return "enchantment"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "warlock"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(Enthrall, Enthrall.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "wisdom" });
        tempFeatures.push(character.getSpellCard(Enthrall, Enthrall.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Enthrall.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You weave a distracting string of words, causing creatures of your choice that you can see within range and that can hear you to make a Wisdom saving throw. Any creature that can’t be charmed succeeds on this saving throw automatically, and if you or your companions are fighting a creature, it has advantage on the save. On a failed save, the target has disadvantage on Wisdom (Perception) checks made to perceive any creature other than you until the spell ends or until the target can no longer hear you. The spell ends if you are incapacitated or can no longer speak.
        </p>
    `;

}
