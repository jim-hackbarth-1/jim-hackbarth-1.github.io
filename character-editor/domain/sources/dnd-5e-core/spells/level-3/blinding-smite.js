
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class BlindingSmite {

    static get name() { return "blinding-smite"; }
    static get title() { return "Blinding Smite"; }
    static get level() { return 3; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["paladin"]; }
    static get castingTime() { return "1 bonus action"; }
    static get range() { return "Self"; }
    static get components() { return "V"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(BlindingSmite, BlindingSmite.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "constitution" });
        tempFeatures.push(character.getSpellCard(BlindingSmite, BlindingSmite.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = BlindingSmite.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            The next time you hit a creature with a melee weapon attack during this spell’s duration, you weapon flares with a bright light, and the attack deals an extra 3d8 radiant damage to the target. Additionally, the target must succeed on a Constitution saving throw or be blinded until the spell ends.
        </p>
        <p>
            A creature blinded by this spell makes another Constitution saving throw at the end of each of its turns. On a successful save, it is no longer blinded.
        </p>
    `;

}
