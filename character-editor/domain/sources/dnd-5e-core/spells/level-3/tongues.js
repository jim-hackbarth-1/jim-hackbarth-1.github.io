
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Tongues {

    static get name() { return "tongues"; }
    static get title() { return "Tongues"; }
    static get level() { return 3; }
    static get school() { return "divination"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "cleric", "sorcerer", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, M (a small clay model of a ziggurat)"; }
    static get duration() { return "1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(Tongues, Tongues.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Tongues, Tongues.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Tongues.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            This spell grants the creature you touch the ability to understand any spoken language it hears. Moreover, when the target speaks, any creature that knows at least one language and can hear the target understands what it says.
        </p>
    `;

}
