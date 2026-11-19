
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class RemoveCurse {

    static get name() { return "remove-curse"; }
    static get title() { return "Remove Curse"; }
    static get level() { return 3; }
    static get school() { return "abjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric", "paladin", "warlock", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Touch"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(RemoveCurse, RemoveCurse.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(RemoveCurse, RemoveCurse.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = RemoveCurse.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            At your touch, all curses affecting one creature or object end. If the object is a cursed magic item, its curse remains, but the spell breaks its owner’s attunement to the object so it can be removed or discarded.
        </p>
    `;

}
