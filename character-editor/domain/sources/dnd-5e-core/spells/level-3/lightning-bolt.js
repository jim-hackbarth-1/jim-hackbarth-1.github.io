
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class LightningBolt {

    static get name() { return "lightning-bolt"; }
    static get title() { return "Lightning Bolt"; }
    static get level() { return 3; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self (100-foot line)"; }
    static get components() { return "V, S, M (a bit of fur and a rod of amber, crystal, or glass)"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(LightningBolt, LightningBolt.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo(
            { target: "dc", saveAbility: "dexterity", damageDice: "8d6", damageType: "lightning", notes: ["Half damage on save"] });
        tempFeatures.push(character.getSpellCard(LightningBolt, LightningBolt.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = LightningBolt.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A stroke of lightning forming a line of 100 feet long and 5 feet wide blasts out from you in a direction you choose. Each creature in the line must make a Dexterity saving throw. A creature takes 8d6 lightning damage on a failed save, or half as much damage on a successful one.
        </p>
        <p>
            The lightning ignites flammable objects in the area that aren’t being worn or carried.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.
        </p>
    `;

}
