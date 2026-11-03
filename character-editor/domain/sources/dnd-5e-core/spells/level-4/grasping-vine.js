
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class GraspingVine {

    static get name() { return "grasping-vine"; }
    static get title() { return "Grasping Vine"; }
    static get level() { return 4; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid", "ranger"]; }
    static get castingTime() { return "1 bonus action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(GraspingVine, GraspingVine.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        const attackInfo = character.getAttackInfo({ target: "dc", saveAbility: "dexterity" });
        tempFeatures.push(character.getSpellCard(GraspingVine, GraspingVine.#content, characterSpellClasses, attackInfo));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = GraspingVine.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You conjure a vine that sprouts from the ground in an unoccupied space of your choice that you can see within range. When you cast this spell, you can direct the vine to lash out at a creature within 30 feet of it that you can see. That creature must succeed on a Dexterity saving throw or be pulled 20 feet directly toward the vine.
        </p>
        <p>
            Until the spell ends, you can direct the vine to lash out at the same creature or another one as a bonus action on each of your turns.
        </p>
    `;

}
