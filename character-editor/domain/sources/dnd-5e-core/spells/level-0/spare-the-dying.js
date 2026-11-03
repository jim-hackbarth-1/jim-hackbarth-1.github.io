
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class SpareTheDying {

    static get name() { return "spare-the-dying"; }
    static get title() { return "Spare the Dying"; }
    static get level() { return 0; }
    static get school() { return "necromancy" }
    static get isRitual() { return false; }
    static get classes() { return ["cleric"]; }
    static get castingTime() { return "1 action" }
    static get range() { return "Touch" }
    static get components() { return "V, S" }
    static get duration() { return "Instantaneous" }
    static get html() { return DnD5ESource.getSpellHtml(SpareTheDying, SpareTheDying.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(SpareTheDying, SpareTheDying.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = SpareTheDying.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You touch a living creature that has 0 hit points. The creature becomes stable. This spell has no effect on undead or constructs.
        </p>
    `;

}

