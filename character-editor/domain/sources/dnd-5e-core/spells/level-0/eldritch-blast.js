
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class EldritchBlast {

    static get name() { return "eldritch-blast"; }
    static get title() { return "Eldritch Blast"; }
    static get level() { return 0; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["warlock"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "120 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(EldritchBlast, EldritchBlast.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "to-hit", damageDice: "1d10", damageType: "force" });
        const spellCard = character.getSpellCard(EldritchBlast, EldritchBlast.#content, characterSpellClasses, attackInfo);
        tempFeatures.push(spellCard);
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = EldritchBlast.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A beam of crackling energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 force damage.
        </p>
        <p>
            At Higher Levels. The spell creates more than one beam when you reach higher levels: two beams at 5th level, three beams at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.
        </p>
    `;

}
