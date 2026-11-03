
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Friends {

    static get name() { return "friends"; }
    static get title() { return "Friends"; }
    static get level() { return 0; }
    static get school() { return "enchantment"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "10 feet"; }
    static get components() { return "S, M (some makeup)"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(Friends, Friends.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "wisdom" });
        tempFeatures.push(character.getSpellCard(Friends, Friends.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Friends.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You magically emanate a sense of friendship toward one creature you can see within range. The target must succeed on a Wisdom saving throw or have the Charmed condition for the duration. The target succeeds automatically if it isn’t a Humanoid, if you’re fighting it, or if you have cast this spell on it within the past 24 hours.
        </p>
        <p>
            The spell ends early if the target takes damage or if you make an attack roll, deal damage, or force anyone to make a saving throw. When the spell ends, the target knows it was Charmed by you.
        </p>
    `;

}
