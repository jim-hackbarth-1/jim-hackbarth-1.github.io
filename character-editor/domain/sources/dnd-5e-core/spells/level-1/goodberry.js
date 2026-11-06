
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Goodberry {

    static get name() { return "goodberry"; }
    static get title() { return "Goodberry"; }
    static get level() { return 1; }
    static get school() { return "transmutation"; }
    static get isRitual() { return false; }
    static get classes() { return ["druid", "ranger"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S, M (a sprig of mistletoe)"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(Goodberry, Goodberry.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Goodberry, Goodberry.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Goodberry.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Up to ten berries appear in your hand and are infused with magic for the duration. A creature can use its action to eat one berry. Eating a berry restores 1 hit point, and the berry provides enough nourishment to sustain a creature for one day.
        </p>
        <p>
            The berries lose their potency if they have not been consumed within 24 hours of the casting of this spell.
        </p>
    `;

}
