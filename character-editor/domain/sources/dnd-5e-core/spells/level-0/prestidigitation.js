
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Prestidigitation {

    static get name() { return "prestidigitation"; }
    static get title() { return "Prestidigitation"; }
    static get level() { return 0; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "10 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Up to 1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(Prestidigitation, Prestidigitation.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Prestidigitation, Prestidigitation.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Prestidigitation.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            This spell is a minor magical trick that novice spellcasters use for practice. You create one of the following magical effects within range:
        </p>
        <ul>
            <li>
                You create an instantaneous, harmless sensory effect, such as a shower of sparks, a puff of wind, faint musical notes, or an odd odor.
            </li>
            <li>
                You instantaneously light or snuff out a candle, a torch, or a small campfire.
            </li>
            <li>
                You instantaneously clean or soil an object no larger than 1 cubic foot.
            </li>
            <li>
                You chill, warm, or flavor up to 1 cubic foot of nonliving material for 1 hour.
            </li>
            <li>
                You make a color, a small mark, or a symbol appear on an object or a surface for 1 hour.
            </li>
            <li>
                You create a nonmagical trinket or an illusory image that can fit in your hand and that lasts until the end of your next turn.
            </li>
        </ul>
        <p>
            If you cast this spell multiple times, you can have up to three of its non-instantaneous effects active at a time, and you can dismiss such an effect as an action.
        </p>
    `;

}
