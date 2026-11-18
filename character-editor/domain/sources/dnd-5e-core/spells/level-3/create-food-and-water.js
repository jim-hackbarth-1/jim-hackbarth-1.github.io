
import { DnD5ESource } from "../../dnd-5e-core-source.js";

export class CreateFoodAndWater {

    static get name() { return "create-food-and-water"; }
    static get title() { return "Create Food and Water"; }
    static get level() { return 3; }
    static get school() { return "conjuration"; }
    static get isRitual() { return false; }
    static get classes() { return ["cleric", "paladin"]; }
    static get castingTime() { return "1 action"; }
    static get range() { return "30 feet"; }
    static get components() { return "V, S"; }
    static get duration() { return "Instantaneous"; }
    static get html() { return DnD5ESource.getSpellHtml(CreateFoodAndWater, CreateFoodAndWater.#content); }

    static applyFeatures(features, character, characterSpellClasses) {
        const tempFeatures = [];
        tempFeatures.push(character.getSpellCard(CreateFoodAndWater, CreateFoodAndWater.#content));
        for (const feature of tempFeatures) {
            feature.sourcePropertyName = "spell";
            feature.sourcePropertyValue = CreateFoodAndWater.name;
            features.push(feature);
        }
    }

    static #content = `
        <p>
            You create 45 pounds of food and 30 gallons of water on the ground or in containers within range, enough to sustain up to fifteen humanoids or five steeds for 24 hours. The food is bland but nourishing, and spoils if uneaten after 24 hours. The water is clean and doesn’t go bad.
        </p>
    `;

}
