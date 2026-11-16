
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Levitate {

    static get name() { return "levitate"; }
    static get title() { return "Levitate"; }
    static get level() { return 2; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V"; }
    static get duration() { return "V, S, M (either a small leather loop or a piece of golden wire bent into a cup shape with a long shank on one end)"; }
    static get html() { return DnD5ESource.getSpellHtml(Levitate, Levitate.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Levitate, Levitate.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Levitate.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            One creature or loose object of your choice that you can see within range rises vertically, up to 20 feet, and remains suspended there for the duration. The spell can levitate a target that weighs up to 500 pounds. An unwilling creature that succeeds on a Constitution saving throw is unaffected.
        </p>
        <p>
            The target can move only by pushing or pulling against a fixed object or surface within reach (such as a wall or a ceiling), which allows it to move as if it were climbing. You can change the target’s altitude by up to 20 feet in either direction on your turn. If you are the target, you can move up or down as part of your move. Otherwise, you can use your action to move the target, which must remain within the spell’s range.
        </p>
        <p>
            When the spell ends, the target floats gently to the ground if it is still aloft.
        </p>
    `;

}
