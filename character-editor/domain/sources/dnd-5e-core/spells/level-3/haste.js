
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Haste {

    static get name() { return "haste"; }
    static get title() { return "Haste"; }
    static get level() { return 3; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S, M (a shaving of licorice root)"; }
    static get duration() { return "Concentration, up to 1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(Haste, Haste.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Haste, Haste.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Haste.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Choose a willing creature that you can see within range. Until the spell ends, the target’s speed is doubled, it gains a +2 bonus to AC, it has advantage on Dexterity saving throws, and it gains an additional action on each of its turns. That action can be used only to take the Attack (one weapon attack only), Dash, Disengage, Hide, or Use an Object action.
        </p>
        <p>
            When the spell ends, the target can’t move or take actions until after its next turn, as a wave of lethargy sweeps over it.
        </p>
    `;

}
