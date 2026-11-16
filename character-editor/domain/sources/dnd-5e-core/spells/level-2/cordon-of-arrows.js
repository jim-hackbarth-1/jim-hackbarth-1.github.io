
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class CordonOfArrows {

    static get name() { return "cordon-of-arrows"; }
    static get title() { return "Cordon of Arrows"; }
    static get level() { return 2; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["ranger"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "5 feet"; }
    static get components() { return "V, S, M (four or more arrows or bolts)"; }
    static get duration() { return "8 hours"; }
    static get html() { return DnD5ESource.getSpellHtml(CordonOfArrows, CordonOfArrows.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo(
            { target: "dc", saveAbility: "dexterity", damageDice: "1d6", damageType: "piercing" });
        tempFeatures.push(character.getSpellCard(CordonOfArrows, CordonOfArrows.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = CordonOfArrows.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You plant four pieces of nonmagical ammunition – arrows or crossbow bolts – in the ground within range and lay magic upon them to protect an area. Until the spell ends, whenever a creature other than you comes within 30 feet of the ammunition for the first time on a turn or ends its turn there, one piece of ammunition flies up to strike it. The creature must succeed on a Dexterity saving throw or take 1d6 piercing damage. The piece of ammunition is then destroyed. The spell ends when no ammunition remains.
        </p>
        <p>
            When you cast this spell, you can designate any creatures you choose, and the spell ignores them.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, the amount of ammunition that can be affected increases by two for each slot level above 2nd.
        </p>
    `;

}
