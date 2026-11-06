
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ArmsOfHadar {

    static get name() { return "arms-of-hadar"; }
    static get title() { return "Arms of Hadar"; }
    static get level() { return 1; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["warlock"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self (10-foot radius)"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(ArmsOfHadar, ArmsOfHadar.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];

        const attackInfo = character.getAttackInfo(
            { target: "dc", saveAbility: "strength", damageDice: "2d6", damageType: "necrotic", notes: ["Half damage on save"] });
        tempFeatures.push(character.getSpellCard(BurningHands, ArmsOfHadar.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ArmsOfHadar.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You invoke the power of Hadar, the Dark Hunger. Tendrils of dark energy erupt from you and batter all creatures within 10 feet of you. Each creature in that area must make a Strength saving throw. On a failed save, a target takes 2d6 necrotic damage and can’t take reactions until its next turn. On a successful save, the creature takes half damage, but suffers no other effect.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.
        </p>
    `;

}
