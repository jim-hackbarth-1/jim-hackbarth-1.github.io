
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ScorchingRay {

    static get name() { return "scorching-ray"; }
    static get title() { return "Scorching Ray"; }
    static get level() { return 2; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "120 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(ScorchingRay, ScorchingRay.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "to-hit", damageDice: "2d6", damageType: "fire" });
        tempFeatures.push(character.getSpellCard(ScorchingRay, ScorchingRay.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ScorchingRay.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You create three rays of fire and hurl them at targets within range. You can hurl them at one target or several. Make a ranged spell attack for each ray. On a hit, the target takes 2d6 fire damage.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, you create one additional ray for each slot level above 2nd.
        </p>
    `;

}
