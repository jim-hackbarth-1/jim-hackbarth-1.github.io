
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ThunderousSmite {

    static get name() { return "thunderous-smite"; }
    static get title() { return "Thunderous Smite"; }
    static get level() { return 1; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["paladin"]; }
    static get castingTime() { return "1 bonus action"; }
    static get range() { return "Self"; }
    static get components() { return "V"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(ThunderousSmite, ThunderousSmite.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "strength" });
        tempFeatures.push(character.getSpellCard(ThunderousSmite, ThunderousSmite.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ThunderousSmite.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            The first time you hit with a melee weapon attack during this spell’s duration, your weapon rings with thunder that is audible within 300 feet of you, and the attack deals an extra 2d6 thunder damage to the target. Additionally, if the target is a creature, it must succeed on a Strength saving throw or be pushed 10 feet away from you and knocked prone.
        </p>
    `;

}
