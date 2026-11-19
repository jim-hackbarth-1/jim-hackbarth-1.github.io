
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class PhantomSteed {

    static get name() { return "phantom-steed"; }
    static get title() { return "Phantom Steed"; }
    static get level() { return 3; }
    static get school() { return "illusion"; }
    static get isRitual() { return true; }
    static get classes() { return ["wizard"]; }
    static get castingTime() { return "1 minute"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "1 hour"; }
    static get html() { return DnD5ESource.getSpellHtml(PhantomSteed, PhantomSteed.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(PhantomSteed, PhantomSteed.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = PhantomSteed.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            A Large quasi-real, horselike creature appears on the ground in an unoccupied space of your choice within range. You decide the creature’s appearance, but it is equipped with a saddle, bit, and bridle. Any of the equipment created by the spell vanishes in a puff of smoke if it is carried more than 10 feet away from the steed.
        </p>
        <p>
            For the duration, you or a creature you choose can ride the steed. The creature uses the statistics for a riding horse, except it has a speed of 100 feet and can travel 10 miles in an hour, or 13 miles at a fast pace. When the spell ends, the steed gradually fades, giving the rider 1 minute to dismount. The spell ends if you use an action to dismiss it or if the steed takes any damage.
        </p>
    `;

}
