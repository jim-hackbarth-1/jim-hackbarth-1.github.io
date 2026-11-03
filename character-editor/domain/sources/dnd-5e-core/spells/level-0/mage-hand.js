
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class MageHand {

    static get name() { return "mage-hand"; }
    static get title() { return "Mage Hand"; }
    static get level() { return 0; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "1 minute"; }
    static get html() { return DnD5ESource.getSpellHtml(MageHand, MageHand.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(MageHand, MageHand.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = MageHand.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again.
        </p>
        <p>
            You can use your action to control the hand. You can use the hand to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial. You can move the hand up to 30 feet each time you use it.
        </p>
        <p>
            The hand can’t attack, activate magical items, or carry more than 10 pounds.
        </p>
    `;

}
