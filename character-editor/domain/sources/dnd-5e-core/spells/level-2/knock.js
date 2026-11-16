
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Knock {

    static get name() { return "knock"; }
    static get title() { return "Knock"; }
    static get level() { return 2; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(Knock, Knock.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Knock, Knock.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Knock.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Choose an object that you can see within range. The object can be a door, a box, a chest, a set of manacles, a padlock, or another object that contains a mundane or magical means that prevents access.
        </p>
        <p>
            A target that is held shut by a mundane lock or that is stuck or barred becomes unlocked, unstuck, or unbarred. If the object has multiple locks, only one of them is unlocked.
        </p>
        <p>
            If you choose a target that is held shut with Arcane Lock, that spell is suppressed for 10 minutes, during which time the target can be opened and shut normally.
        </p>
        <p>
            When you cast the spell, a loud knock, audible from as far away as 300 feet, emanates from the target object.
        </p>
    `;

}
