
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Cloudkill {

    static get name() { return "cloudkill"; }
    static get title() { return "Cloudkill"; }
    static get level() { return 5; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "120 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Concentration, up to 10 minutes"; }
    static get html() { return DnD5ESource.getSpellHtml(Cloudkill, Cloudkill.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({
            target: "dc", saveAbility: "constitution", damageDice: "5d8", damageType: "poison", notes: ["Half damage on save"]
        });
        tempFeatures.push(character.getSpellCard(Cloudkill, Cloudkill.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Cloudkill.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You create a 20-foot-radius sphere of poisonous, yellow-green fog centered on a point you choose within range. The fog spreads around corners. It lasts for the duration or until strong wind disperses the fog, ending the spell. Its area is heavily obscured.
        </p>
        <p>
            When a creature enters the spell’s area for the first time on a turn or starts its turn there, that creature must make a Constitution saving throw. The creature takes 5d8 poison damage on a failed save, or half as much damage on a successful one. Creatures are affected even if they hold their breath or don’t need to breathe.
        </p>
        <p>
            The fog moves 10 feet away from you at the start of each of your turns, rolling along the surface of the ground. The vapors, being heavier than air, sink to the lowest level of the land, even pouring down openings.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d8 for each slot level above 5th.
        </p>
    `;

}
