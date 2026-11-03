
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class FreedomOfMovement {

    static get name() { return "freedom-of-movement"; }
    static get title() { return "Freedom of Movement"; }
    static get level() { return 4; }
    static get school() { return "abjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "cleric", "druid", "ranger"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (a leather strap, bound around the arm or a similar appendage)"; }
    static get duration() { return "1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(FreedomOfMovement, FreedomOfMovement.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(FreedomOfMovement, FreedomOfMovement.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = FreedomOfMovement.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You touch a willing creature. For the duration, the target’s movement is unaffected by difficult terrain, and spells and other magical effects can neither reduce the target’s speed nor cause the target to be paralyzed or restrained.
        </p>
        <p>
            The target can also spend 5 feet of movement to automatically escape from nonmagical restraints, such as manacles or a creature that has it grappled. Finally, being underwater imposes no penalties on the target’s movement or attacks.
        </p>
    `;

}
