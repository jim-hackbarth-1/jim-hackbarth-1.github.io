
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class PurifyFoodAndDrink {

    static get name() { return "purify-food-and-drink"; }
    static get title() { return "Purify Food and Drink"; }
    static get level() { return 1; }
    static get school() { return "transmutation"; }
    static get isRitual() { return true; }
    static get classes() { return ["cleric", "druid", "paladin"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "10 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(PurifyFoodAndDrink, PurifyFoodAndDrink.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(PurifyFoodAndDrink, PurifyFoodAndDrink.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = PurifyFoodAndDrink.name
            features.push(feature);
        }
    }

    static #content = `
        <p>
            All nonmagical food and drink within a 5-foot-radius sphere centered on a point of your choice within range is purified and rendered free of poison and disease.
        </p>
    `;

}
