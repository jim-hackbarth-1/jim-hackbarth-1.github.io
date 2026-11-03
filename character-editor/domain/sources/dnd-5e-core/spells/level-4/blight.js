
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Blight {

    static get name() { return "blight"; }
    static get title() { return "Blight"; }
    static get level() { return 4; }
    static get school() { return "necromancy"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid", "sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(Blight, Blight.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo(
            { target: "dc", saveAbility: "constitution", damageDice: "8d8", damageType: "necrotic", notes: ["Half damage on save"] });
        tempFeatures.push(character.getSpellCard(Blight, Blight.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Blight.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Necromantic energy washes over a creature of your choice that you can see within range, draining moisture and vitality from it. The target must make a Constitution saving throw. The target takes 8d8 necrotic damage on a failed save, or half as much damage on a successful one. This spell has no effect on undead or constructs.
        </p>
        <p>
            If you target a plant creature or a magical plant, it makes the saving throw with disadvantage, and the spell deals maximum damage to it. If you target a nonmagical plant that isn’t a creature, such as a tree or shrub, it doesn’t make a saving throw; it simply withers and dies.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 5th level or higher, the damage increases by 1d8 for each slot level above 4th.
        </p>
    `;

}
