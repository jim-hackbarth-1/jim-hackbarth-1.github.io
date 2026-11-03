
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class MirrorImage {

    static get name() { return "mirror-image"; }
    static get title() { return "Mirror Image"; }
    static get level() { return 2; }
    static get school() { return "illusion"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self"; }
    static get components() { return "V, S"; }
    static get duration() { return "1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(MirrorImage, MirrorImage.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(MirrorImage, MirrorImage.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = MirrorImage.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Three illusory duplicates of yourself appear in your space. Until the spell ends, the duplicates move with you and mimic your actions, shifting position so it’s impossible to track which image is real. You can use your action to dismiss the illusory duplicates.
        </p>
        <p>
            Each time a creature targets you with an attack during the spell’s duration, roll a d20 to determine whether the attack instead targets one of your duplicates.
        </p>
        <p>
            If you have three duplicates, you must roll a 6 or higher to change the attack’s target to a duplicate. With two duplicates, you must roll an 8 or higher. With one duplicate, you must roll an 11 or higher.
        </p>
        <p>
            A duplicate’s AC equals 10 + your Dexterity modifier. If an attack hits a duplicate, the duplicate is destroyed. A duplicate can be destroyed only by an attack that hits it. It ignores all other damage and effects. The spell ends when all three duplicates are destroyed.
        </p>
        <p>
            A creature is unaffected by this spell if it can’t see, if it relies on senses other than sight, such as blindsight, or if it can perceive illusions as false, as with truesight.
        </p>
    `;

}
