
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class InsectPlague {

    static get name() { return "insect-plague"; }
    static get title() { return "Insect Plague"; }
    static get level() { return 5; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric", "druid", "sorcerer"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "300 feet"; }
    static get components() { return "V, S, M (a few grains of sugar, some kernels of grain, and a smear of fat)"; }
    static get duration() { return "Concentration, up to 10 minutes"; }
    static get html() { return DnD5ESource.getSpellHtml(InsectPlague, InsectPlague.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({
            target: "dc", saveAbility: "constitution", damageDice: "4d10", damageType: "piercing", notes: ["Half damage on save"]
        });
        tempFeatures.push(character.getSpellCard(InsectPlague, InsectPlague.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = InsectPlague.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Swarming, biting locusts fill a 20-foot-radius sphere centered on a point you choose within range. The sphere spreads around corners. The sphere remains for the duration, and its area is lightly obscured. The sphere’s area is difficult terrain.
        </p>
        <p>
            When the area appears, each creature in it must make a Constitution saving throw. A creature takes 4d10 piercing damage on a failed save, or half as much damage on a successful one. A creature must also make this saving throw when it enters the spell’s area for the first time on a turn or ends its turn there.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d10 for each slot level above 5th.
        </p>
    `;

}
