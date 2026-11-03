
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class FlamingSphere {

    static get name() { return "flaming-sphere"; }
    static get title() { return "Flaming Sphere"; }
    static get level() { return 2; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, S, M (a bit of tallow, a pinch of brimstone, and a dusting of powdered iron)"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(FlamingSphere, FlamingSphere.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo(
            { target: "dc", saveAbility: "dexterity", damageDice: "2d6", damageType: "fire", notes: ["Half damage on save"] });
        tempFeatures.push(character.getSpellCard(FlamingSphere, FlamingSphere.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = FlamingSphere.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A 5-foot-diameter sphere of fire appears in an unoccupied space of your choice within range and lasts for the duration. Any creature that ends its turn within 5 feet of the sphere must make a Dexterity saving throw. The creature takes 2d6 fire damage on a failed save, or half as much damage on a successful one.
        </p>
        <p>
            As a bonus action, you can move the sphere up to 30 feet. If you ram the sphere into a creature, that creature must make the saving throw against the sphere’s damage, and the sphere stops moving this turn.
        </p>
        <p>
            When you move the sphere, you can direct it over barriers up to 5 feet tall and jump it across pits up to 10 feet wide. The sphere ignites flammable objects not being worn or carried, and it sheds bright light in a 20-foot radius and dim light for an additional 20 feet.
        </p>
            At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d6 for each slot level above 2nd.
        </p>
    `;

}
