
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class LocateObject {

    static get name() { return "locate-object"; }
    static get title() { return "Locate Object"; }
    static get level() { return 2; }
    static get school() { return "divination"; }
    static get isRitual() { return false; }
    static get classes() { return ["bard", "cleric", "druid", "paladin", "ranger", "wizard"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "Self"; }
    static get components() { return "V, S, M (a forked twig)"; }
    static get duration() { return "Concentration, up to 10 minutes"; }
    static get html() { return DnD5ESource.getSpellHtml(LocateObject, LocateObject.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(LocateObject, LocateObject.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = LocateObject.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            Describe or name an object that is familiar to you. You sense the direction to the object’s location, as long as that object is within 1,000 feet of you. If the object is in motion, you know the direction of its movement.
        </p>
        <p>
            The spell can locate a specific object known to you, as long as you have seen it up close – within 30 feet – at least once. Alternatively, the spell can locate the nearest object of a particular kind, such as a certain kind of apparel, jewelry, furniture, tool, or weapon.
        </p>
        <p>
            This spell can’t locate an object if any thickness of lead, even a thin sheet, blocks a direct path between you and the object.
        </p>
    `;

}
