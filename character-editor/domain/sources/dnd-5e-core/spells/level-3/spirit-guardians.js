
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class SpiritGuardians {

    static get name() { return "spirit-guardians"; }
    static get title() { return "Spirit Guardians"; }
    static get level() { return 3; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self (15-foot-radius)"; }
    static get components() { return "V, S, M (a holy symbol)"; }
    static get duration() { return "Concentration, up to 10 minutes"; }
    static get html() { return DnD5ESource.getSpellHtml(SpiritGuardians, SpiritGuardians.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo(
            { target: "dc", saveAbility: "wisdom", damageDice: "3d8", damageType: "radiant or necrotic", notes: ["Half damage on save"] });
        tempFeatures.push(character.getSpellCard(SpiritGuardians, SpiritGuardians.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = SpiritGuardians.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You call forth spirits to protect you. They flit around you to a distance of 15 feet for the duration. If you are good or neutral, their spectral form appears angelic or fey (your choice). If you are evil, they appear fiendish.
        </p>
        <p>
            When you cast this spell, you can designate any number of creatures you can see to be unaffected by it. An affected creature’s speed is halved in the area, and when the creature enters the area for the first time on a turn or starts its turn there, it must make a Wisdom saving throw. On a failed save, the creature takes 3d8 radiant damage (if you are good or neutral) or 3d8 necrotic damage (if you are evil). On a successful save, the creature takes half as much damage.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d8 for each slot level above 3rd.
        </p>
    `;

}
