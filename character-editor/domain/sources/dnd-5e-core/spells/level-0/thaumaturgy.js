
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class Thaumaturgy {

    static get name() { return "thaumaturgy"; }
    static get title() { return "Thaumaturgy"; }
    static get level() { return 0; }
    static get school() { return "transmutation" }
    static get isRitual() { return false; }
    static get classes() { return ["cleric"]; }
    static get castingTime() { return "1 action" }
    static get range() { return "30 feet" }
    static get components() { return "V" }
    static get duration() { return "Up to 1 minute" }
    static get html() { return DnD5ESource.getSpellHtml(Thaumaturgy, Thaumaturgy.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(Thaumaturgy, Thaumaturgy.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = Thaumaturgy.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You manifest a minor wonder, a sign of supernatural power, within range. You create one of the following magical effects within range:
            <ul>
                <li>Your voice booms up to three times as loud as normal for 1 minute.</li>
                <li>You cause flames to flicker, brighten, dim, or change color for 1 minute.</li>
                <li>You cause harmless tremors in the ground for 1 minute.</li>
                <li>You create an instantaneous sound that originates from a point of your choice within range, such as a rumble of thunder, the cry of a raven, or ominous whispers.</li>
                <li>You instantaneously cause an unlocked door or window to fly open or slam shut.</li>
                <li>You alter the appearance of your eyes for 1 minute.</li>
                <li>If you cast this spell multiple times, you can have up to three of its 1-minute effects active at a time, and you can dismiss such an effect as an action.</li>
            </ul>
        </p>
    `;

}
