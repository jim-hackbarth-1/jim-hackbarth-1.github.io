
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class InflictWounds {

    static get name() { return "inflict-wounds"; }
    static get title() { return "Inflict Wounds"; }
    static get level() { return 1; }
    static get school() { return "necromancy"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(InflictWounds, InflictWounds.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "to-hit", damageDice: "3d10", damageType: "necrotic" });
        tempFeatures.push(character.getSpellCard(InflictWounds, InflictWounds.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = InflictWounds.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Make a melee spell attack against a creature you can reach. On a hit, the target takes 3d10 necrotic damage.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.
        </p>
    `;

}
