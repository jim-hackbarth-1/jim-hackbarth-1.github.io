
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class UnseenServant {

    static get name() { return "unseen-servant"; }
    static get title() { return "Unseen Servant"; }
    static get level() { return 1; }
    static get school() { return "conjuration"; }
    static get isRitual() { return true; }
    static get classes() { return ["bard", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "60 feet"; }
    static get components() { return "V, S, M (a piece of string and a bit of wood)"; }
    static get duration() { return "1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(UnseenServant, UnseenServant.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(UnseenServant, UnseenServant.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = UnseenServant.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            This spell creates an invisible, mindless, shapeless, Medium force that performs simple tasks at your command until the spell ends. The servant springs into existence in an unoccupied space on the ground within range. It has AC 10, 1 hit point, and a Strength of 2, and it can’t attack. If it drops to 0 hit points, the spell ends.
        </p>
        <p>
            Once on each of your turns as a bonus action, you can mentally command the servant to move up to 15 feet and interact with an object. The servant can perform simple tasks that a human servant could do, such as fetching things, cleaning, mending, folding clothes, lighting fires, serving food, and pouring wine. Once you give the command, the servant performs the task to the best of its ability until it completes the task, then waits for your next command.
        </p>
        <p>
            If you command the servant to perform a task that would move it more than 60 feet away from you, the spell ends.
        </p>
    `;

}
