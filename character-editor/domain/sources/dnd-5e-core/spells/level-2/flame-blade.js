
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class FlameBlade {

    static get name() { return "flame-blade"; }
    static get title() { return "Flame Blade"; }
    static get level() { return 2; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid"]; }
    static get castingTime() { return "1 bonus action"; }
    static get range() { return "Self"; }
    static get components() { return "V, S, M (a leaf of sumac)"; }
    static get duration() { return "Concentration, up to 10 minutes"; }
    static get html() { return DnD5ESource.getSpellHtml(FlameBlade, FlameBlade.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo(
            { target: "to-hit", damageDice: "3d6", damageType: "fire", applyAbilityModifierToDamage: false });
        tempFeatures.push(character.getSpellCard(FlameBlade, FlameBlade.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = FlameBlade.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You evoke a fiery blade in your free hand. The blade is similar in size and shape to a scimitar, and it lasts for the duration. If you let go of the blade, it disappears, but you can evoke the blade again as a bonus action.
        </p>
        <p>
            You can use your action to make a melee spell attack with the fiery blade. On a hit, the target takes 3d6 fire damage. The flaming blade sheds bright light in a 10-foot radius and dim light for an additional 10 feet.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for every two slot levels above 2nd.
        </p>
    `;

}
