
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ConeOfCold {

    static get name() { return "cone-of-cold"; }
    static get title() { return "Cone of Cold"; }
    static get level() { return 5; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self (60-foot cone)"; }
    static get components() { return "V, S, M (a small crystal or glass cone)"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(ConeOfCold, ConeOfCold.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({
            target: "dc", saveAbility: "constitution", damageDice: "8d8", damageType: "cold", notes: ["Half damage on save"]
        });
        tempFeatures.push(character.getSpellCard(ConeOfCold, ConeOfCold.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ConeOfCold.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A blast of cold air erupts from your hands. Each creature in a 60-foot cone must make a Constitution saving throw. A creature takes 8d8 cold damage on a failed save, or half as much damage on a successful one. A creature killed by this spell becomes a frozen statue until it thaws.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d8 for each slot level above 5th.
        </p>
    `;

}
