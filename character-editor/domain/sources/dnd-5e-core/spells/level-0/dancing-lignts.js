
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class DancingLights {

    static get name() { return "dancing-lights"; }
    static get title() { return "Dancing Lights"; }
    static get level() { return 0; }
    static get school() { return "evocation"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "120 feet"; }
    static get components() { return "V, S, M (a bit of phosphorus or wychwood, or a glowworm)"; }
    static get duration() { return "Concentration, up to 1 minute"; }

    static get html() { return DnD5ESource.getSpellHtml(DancingLights, DancingLights.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(DancingLights, DancingLights.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = DancingLights.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You create up to four torch-sized lights within range, making them appear as torches, lanterns, or glowing orbs that hover in the air for the duration. You can also combine the four lights into one glowing vaguely humanoid form of Medium size. Whichever form you choose, each light sheds dim light in a 10-foot radius.
        </p>
        <p>
            As a bonus action on your turn, you can move the lights up to 60 feet to a new spot within range. A light must be within 20 feet of another light created by this spell, and a light winks out if it exceeds the spell’s range.
        </p>
    `;

}
