
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class ConjureElemental {

    static get name() { return "conjure-elemental"; }
    static get title() { return "Conjure Elemental"; }
    static get level() { return 5; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid", "wizard"]; }
    static get castingTime() { return "1 minute"; }
    static get range() { return "90 feet"; }
    static get components() { return "V, S, M (burning incense for air, soft clay for earth, sulfur and phosphorus for fire, or water and sand for water)"; }
    static get duration() { return "Concentration, up to 1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(ConjureElemental, ConjureElemental.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(ConjureElemental, ConjureElemental.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = ConjureElemental.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You call forth an elemental servant. Choose an area of air, earth, fire, or water that fills a 10-foot cube within range. An elemental of challenge rating 5 or lower appropriate to the area you chose appears in an unoccupied space within 10 feet of it. For example, a fire elemental emerges from a bonfire, and an earth elemental rises up from the ground. The elemental disappears when it drops to 0 hit points or when the spell ends.
        </p>
        <p>
            The elemental is friendly to you and your companions for the duration. Roll initiative for the elemental, which has its own turns. It obeys any verbal commands that you issue to it (no action required by you). If you don’t issue any commands to the elemental, it defends itself from hostile creatures but otherwise takes no actions.
        </p>
        <p>
            If your concentration is broken, the elemental doesn’t disappear. Instead, you lose control of the elemental, it becomes hostile toward you and your companions, and it might attack. An uncontrolled elemental can’t be dismissed by you, and it disappears 1 hour after you summoned it. The DM has the elemental’s statistics.
        </p>
        <p>
            At Higher Levels. When you cast this spell using a spell slot of 6th level or higher, the challenge rating increases by 1 for each slot level above 5th.
        </p>
    `;

}
