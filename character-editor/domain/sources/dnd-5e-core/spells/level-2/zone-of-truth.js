
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ZoneOfTruth {

    static get name() { return "zone-of-truth"; }
    static get title() { return "Zone of Truth"; }
    static get level() { return 2; }
    static get school() { return "enchantment"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "cleric", "paladin"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "10 minutes"; }
    static get html() { return DnD5ESource.getSpellHtml(ZoneOfTruth, ZoneOfTruth.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "charisma" });
        tempFeatures.push(character.getSpellCard(ZoneOfTruth, ZoneOfTruth.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ZoneOfTruth.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You create a magical zone that guards against deception in a 15-foot-radius sphere centered on a point of your choice within range. Until the spell ends, a creature that enters the spell’s area for the first time on a turn or starts its turn there must make a Charisma saving throw. On a failed save, a creature can’t speak a deliberate lie while in the radius. You know whether each creature succeeds or fails on its saving throw.
        </p>
        <p>
            An affected creature is aware of the spell and can thus avoid answering questions to which it would normally respond with a lie. Such creatures can be evasive in its answers as long as it remains within the boundaries of the truth.
        </p>
    `;

}
