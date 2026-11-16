
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Darkvision {

    static get name() { return "darkvision"; }
    static get title() { return "Darkvision"; }
    static get level() { return 2; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid", "ranger", "sorcerer", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (either a pinch of dried carrot or an agate)"; }
    static get duration() { return "8 hours"; }
    static get html() { return DnD5ESource.getSpellHtml(Darkvision, Darkvision.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Darkvision, Darkvision.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Darkvision.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You touch a willing creature to grant it the ability to see in the dark. For the duration, that creature has darkvision out to a range of 60 feet.
        </p>
    `;

}
